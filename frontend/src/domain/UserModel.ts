export interface UserModel {
  id: number;
  firstName: string; // first_name
  lastName: string; // last_name
  imgUrl: string; // avatar URL, это нужно будет обработать в API
  userName: string; // username
  email: string; // email
  phone: string | null; // phone_number
  sex: string; // sex
  birthday: string; // birth_date
  country: string | null; // country
  city: string | null; // city
  group: string; // group
  socials?: {
    // Ссылки на соцсети
    instagram?: string | null; // instagram
    facebook?: string | null; // facebook
    linkedin?: string | null; // linkedin
    github?: string | null; // github
  };
}
