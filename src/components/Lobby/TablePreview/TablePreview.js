import React from "react";

import {avatarUrlOrDefault} from "../../../auth";
import {
  getUserPlateDistance,
  getUserPlateRotateAngle,
  height
} from "../../util/tableSeatsMath";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

const TablePreview = ({seats}) => {

  const tLen = () => {
    return seats ? seats.length : 0
  }

  const userPlateCss = (position) => {
    const rotateAngle = getUserPlateRotateAngle(tLen(), position);
    const distance = getUserPlateDistance(rotateAngle, 7)
    return {
      transform: `rotate(${rotateAngle}deg) translate(${distance}vw) rotate(-${rotateAngle}deg)`
    }
  }

  return (
    <div>
      <div className='preview-root'>
        <div className="table-logo-rootST">
          <img className='table-logoST' src="https://storage.googleapis.com/pokerblow/logo/Pokerblow-logo-1.png"
               alt="logo"/>
        </div>
        <div className='preview-box'/>
        {
          seats && seats.map(seat => {
            return (
              <div className="preview-item" key={seat.position} style={userPlateCss(seat.position)}>
                {
                  seat.player ?
                    <div className='preview-user-seat'>
                      <div className="preview-user-img ">
                        <img src={avatarUrlOrDefault(seat.player.picture)} alt="..."/>
                      </div>
                      <div className='preview-user-name'>
                        {seat.player.username}
                      </div>
                    </div>
                    :
                    <div>
                      <div className='preview-empty-icon'>
                        <PersonAddIcon/>
                      </div>
                    </div>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default TablePreview