/* eslint-env node */
import { faker } from "@faker-js/faker";

// 100% male-only first names (curated)
const MALE_FIRST_NAMES = [
  "James","John","Robert","Michael","William","David","Richard","Joseph","Thomas","Charles",
  "Christopher","Daniel","Matthew","Anthony","Mark","Donald","Steven","Paul","Andrew","Joshua",
  "Kenneth","Kevin","Brian","George","Timothy","Ronald","Edward","Jason","Jeffrey","Ryan",
  "Jacob","Gary","Nicholas","Eric","Stephen","Jonathan","Larry","Justin","Scott","Brandon",
  "Benjamin","Samuel","Gregory","Frank","Alexander","Raymond","Patrick","Jack","Dennis",
  "Jerry","Tyler","Aaron","Jose","Adam","Nathan","Henry","Douglas","Zachary","Peter","Kyle",
  "Walter","Ethan","Jeremy","Harold","Keith","Christian","Roger","Noah","Gerald","Carl",
  "Terry","Sean","Austin","Arthur","Lawrence","Jesse","Dylan","Bryan","Joe","Jordan",
  "Billy","Bruce","Albert","Willie","Gabriel","Logan","Alan","Juan","Wayne","Roy",
  "Ralph","Randy","Eugene","Vincent","Russell","Elijah","Louis","Bobby","Philip","Johnny",

  "Caleb","Isaiah","Owen","Luke","Mason","Carter","Hunter","Connor","Evan","Adrian",
  "Nolan","Miles","Colton","Trevor","Blake","Spencer","Maxwell","Tristan","Parker","Cooper",
  "Wesley","Damien","Xavier","Chase","Gavin","Leonard","Micah","Joel","Calvin","Grant",
  "Preston","Jared","Marco","Riley","Brent","Derek","Mitchell","Shawn","Malcolm","Andre",
  "Marcus","Darius","Troy","Devin","Quentin","Seth","Oscar","Hector","Edgar","Sergio",
  "Emmanuel","Ivan","Mario","Raul","Julian","Victor","Fernando","Ruben","Martin","Theo",
  "Leon","Dominic","Matteo","Luca","Gianni","Angelo","Franco","Paolo","Enzo","Rafael",
  "Diego","Santiago","Cristian","Lucas","Mateo","Andres","Pablo","Esteban","Hugo","Alberto",
  "Reed","Colby","Tucker","Clayton","Dawson","Easton","Holden","Knox","Zane",
  "Beckett","Ashton","Brody","Griffin","Hayden","Keegan","Landon","Porter","Rowan","Sawyer",
  "Finn","Declan","Cormac","Brendan","Callum","Eamon","Kieran","Ronan","Seamus","Cillian",
  "Ahmad","Hassan","Omar","Khalid","Yusuf","Ibrahim","Malik","Tariq","Zaid","Samir",
  "Kenji","Hiro","Takumi","Sora","Riku","Daichi","Kaito","Ren","Minho","Joon",
  "Taeyang","Hyun","Jisoo","Sung","Wei","Chen","Liang","Bo","Jian","Zhou",
  "Anton","Dmitri","Nikolai","Sergei","Viktor","Mikhail","Andrei","Igor","Pavel","Yuri"
];

export function generateMaleName() {
  const first = faker.helpers.arrayElement(MALE_FIRST_NAMES);
  const last = faker.person.lastName();
  return `${first} ${last}`;
}
