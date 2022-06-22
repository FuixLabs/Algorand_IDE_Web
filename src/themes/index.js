import dark from '../images/theme/dark.svg';
import blue from '../images/theme/blue.svg';
import light from '../images/theme/light.svg';
import projectPageColor_dark from './projectPageColor_dark.json';
import projectPageColor_light from './projectPageColor_light.json';
import projectPAgeColor_nightBlue from './projectPageColor_nightBlue.json';
const colorThemes = [
    {
        id: 1,
        colorSettings: projectPageColor_dark,
        icon: dark,
        text: 'Dark',
    },
    {
        id: 2,
        colorSettings: projectPageColor_light,
        icon: light,
        text: 'Light',
    },
    {
        id: 3,
        colorSettings: projectPAgeColor_nightBlue,
        icon: blue,
        text: 'Night Blue',
    },
];
export default colorThemes;
