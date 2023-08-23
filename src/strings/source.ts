import common from './common'
import welcome from './welcome'

export default {
  // getString('example', { userName: 'Johnny', '#dog': 1, ':customEmoji': <Image /> })
  // example: {
  //   en: 'Testing string builder %{userName} #{dog,cat,dogs} :customEmoji:',
  // },
  en: {
    myBn: 'My B&N',
    myLibrary: 'My Library',
    home: 'Home',
    community: 'Community',
    myProfile: 'My Profile',
    settings: 'Settings',
    interestTitle: 'Your Interests',
    interestHero: 'Choose at least three genres',
    ...common.en,
    ...welcome.en,
  },
}
