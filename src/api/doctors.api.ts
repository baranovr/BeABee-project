// doctors.api.ts

export interface Doctor {
  id: number;
  name: string;
  specifity: number;
  imgUrl: string;
  phone: string;
  address: string;
}

export const getDoctorsData = (): Promise<Doctor[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          id: 1,
          name: 'Cameron Bell',
          specifity: 1,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/cameron-bell.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '98 Santa Clara Court Cherry Hill, NJ 08003',
        },
        {
          id: 2,
          name: 'Kayden Hunter',
          specifity: 2,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/kayden-hunter.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '850 South Tunnel St. Newburgh, NY 12550',
        },
        {
          id: 3,
          name: 'Annabella Morton',
          specifity: 3,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/annabella-morton.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '111 Foxrun Street Conyers, GA 30012',
        },
        {
          id: 4,
          name: 'Steve Wolfe',
          specifity: 4,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/steve.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '9 Wagon Street Ravenna, OH 44266',
        },
        {
          id: 5,
          name: 'James Moss',
          specifity: 5,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/james-moss.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '9568 Tower St. Somerset, NJ 08873',
        },
        {
          id: 6,
          name: 'Sara Mills',
          specifity: 6,
          imgUrl: process.env.REACT_APP_ASSETS_BUCKET + '/doctors/sara-mills.webp',
          phone: '+X-XXX-XXX-XXXX',
          address: '850 South Tunnel St. Newburgh, NY 12550',
        },
      ]);
    }, 0);
  });
};
