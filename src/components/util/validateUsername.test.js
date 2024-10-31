import {validateUsername} from "./validateUsername";

it('validate username', () => {
  expect(validateUsername("denis_glotov").length).toBe(0)
  expect(validateUsername("Denis").length).toBe(0)

  expect(validateUsername("as sa").length).not.toBe(0)
  expect(validateUsername("as").length).not.toBe(0)
  expect(validateUsername("asdhfjhsdjkjfhadsjlfdsahjadfshlkjsdfasds").length).not.toBe(0)
  expect(validateUsername("denis@").length).not.toBe(0)
  expect(validateUsername("_denis").length).not.toBe(0)
  expect(validateUsername("denis_").length).not.toBe(0)
  expect(validateUsername("denis__glotov").length).not.toBe(0)
})