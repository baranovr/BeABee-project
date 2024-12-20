export interface UserModel {
  id: number;
  firstName: string; // first_name
  lastName: string; // last_name
  imgUrl: string; // avatar URL, это нужно будет обработать в API
  nickName: string; // nickname
  email: string; // email
  phone: string | null; // phone_number
  sex: string; // sex
  birthday: string; // birth_date
  country: string | null; // country
  city: string | null; // city
  group: string; // group
  instagram?: string | null; // instagram
  facebook?: string | null; // facebook
  linkedin?: string | null; // linkedin
  github?: string | null; // github
  statusInService: string; //status_in_service
  date_joined: string;
  isBanned: boolean;
  banReason?: string;
}
