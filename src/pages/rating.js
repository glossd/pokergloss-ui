import React, {useEffect, useState} from 'react'
import Header from "../components/Header/Header";
import {getRatingPage} from "../backend/bank";
import {makeStyles} from '@material-ui/core/styles';
import {Pagination} from "@material-ui/lab";
import {useTranslation} from "next-i18next";

import {connect} from "react-redux";
import {setProfileUsername} from "../redux/actions/profile";
import {backendError} from "../backend/error";
import DefaultTableCell from "../components/UI/DefaultTable/DefaultTableCell";
import {nameWithPicture} from "../components/util/defaultTable";
import DefaultTableRow from "../components/UI/DefaultTable/DefaultTableRow";
import DefaultTable from "../components/UI/DefaultTable/DefaultTable";
import {useRouter} from "next/router";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import SEO from "../components/SEO";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  allTable: {
    width: '90%',
    maxWidth: '600px',
    margin: 'auto',
    marginBottom: '30px',
    marginTop: '20px',
  },
  avatar: {
    height: '50px',
    width: '50px',
    borderRadius: '50%'
  },
  head: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '3.5rem',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center'
  }
}));

function Rating({setProfileUsername}) {
  const classes = useStyles();
  const router = useRouter();
  const {t} = useTranslation();
  const [rating, setRating] = useState(null)
  const [ratingError, setRatingError] = useState('')
  const tableHeads = [t("Top Best Players.Rank"), t("Top Best Players.User"), t("Top Best Players.Chips")]

  useEffect(() => {
    getRatingPage(10)
      .then(data => {
        setRating(data)
      })
      .catch((error) => {
        backendError(error)
        setRatingError('Something went wrong. Please try again later.')
      })
  }, [])

  function setPaginationPage(event, pageNumber) {
    getRatingPage(10, pageNumber)
      .then(data => {
        setRating(data)
      })
      .catch((error) => {
        backendError(error)
        setRatingError('Something went wrong. Please try again later.')
      })
  }

  function openUserProfile(username) {
    setProfileUsername(username)
    router.push(`/u/${username}`)
  }

  function isCurrentUserRow(index) {
    return index === rating.userPageIdx
  }

  return (
    <div>
      <SEO title={"Rating.title"} description={"Rating.description"}/>
      <Header
        links={[
          {name: t("Header.Lobby"), to: '/lobby/live'},
          {name: t("Header.Rating")},
        ]}
      />

      <div className='rating-error-message'>{ratingError}</div>
      {
        rating && (
          <div className={classes.root}>

            <DefaultTable
              containerClassName={classes.allTable}
              headers={tableHeads}
              body={
                rating.ratings.map((rating, index) => {
                  return (
                    <DefaultTableRow
                      isCursorPointer={true}
                      className={`${isCurrentUserRow(index) ? "rating-current-user-row" : ""}`}
                      key={rating.userId}
                      onClick={() => openUserProfile(rating.username)}
                    >
                      <DefaultTableCell>{rating.rank}</DefaultTableCell>
                      <DefaultTableCell
                        align={'left'}>{nameWithPicture(rating.username, rating.picture, classes.avatar)}</DefaultTableCell>
                      <DefaultTableCell>{rating.chips}</DefaultTableCell>
                    </DefaultTableRow>
                  )
                })
              }
            />
            <Pagination className={classes.pagination} key={`pagination-${rating.pageNumber}`} count={rating.pageCount}
                        defaultPage={rating.pageNumber} color="primary" onChange={setPaginationPage}/>
          </div>
        )
      }
    </div>
  )
}

export const getStaticProps = async ({ locale }) => ({props: {...await serverSideTranslations(locale)}})

export default connect(null, {setProfileUsername})(Rating)