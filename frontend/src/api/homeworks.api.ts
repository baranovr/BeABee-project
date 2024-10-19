import { newsTags } from 'constants/newsTags';
import { IHashTag } from '@app/components/common/BaseHashTag/BaseHashTag';

const avatar1 = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar1.webp';
const avatar2 = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar2.webp';
const avatar3 = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar3.webp';
const avatar4 = process.env.REACT_APP_ASSETS_BUCKET + '/avatars/avatar4.webp';

export interface Post {
  avatarUrl: string;
  author: string;
  title: string;
  date: string;
  text: string;
  img: string;
  tags: Array<IHashTag>;
}

const { arts, music, health } = newsTags;

export const getNews = (): Promise<Post[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      const currentDate = `created at: ${new Date().toLocaleString()}`;

      res([
        {
          avatarUrl: avatar1,
          author: 'Dr. Dan Reed',
          title: 'Lorem ipsum dolor sit amet',
          date: currentDate,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis dapibus mauris ac mi efficitur, eu venenatis metus mattis. Aenean sit amet imperdiet dui. Sed vel lacinia tellus, vel ornare leo. Duis massa turpis, bibendum nec consectetur non, imperdiet vitae est. Aenean vestibulum non dui in vehicula. Fusce ex velit, iaculis in urna sit amet, congue fringilla orci. Phasellus vitae augue justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed tincidunt lobortis est sit amet porta.',
          img: 'https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567__480.jpg',
          tags: [arts],
        },
        {
          avatarUrl: avatar2,
          author: 'Jordan Howard',
          title: 'Morbi convallis',
          date: currentDate,
          text: 'Interdum et malesuada fames ac ante ipsum primis in faucibus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed sodales erat. Fusce lobortis, dolor vel porttitor porttitor, ipsum lorem pulvinar nunc, ac vestibulum est risus vel turpis. Vestibulum et vestibulum est, vitae placerat lectus. Maecenas arcu sem, congue id metus non, ultricies egestas purus. Integer ut sagittis eros, in posuere arcu. Integer malesuada sapien libero, iaculis hendrerit enim egestas sit amet. In sed sapien in lorem pulvinar sollicitudin. In hendrerit magna felis, vitae fringilla magna imperdiet sed. Nam urna est, feugiat vitae odio tincidunt, lobortis auctor eros. Sed dapibus, nunc eu posuere porta, lectus tellus ornare velit, eu congue orci diam ac lorem. Integer lorem purus, dictum et aliquet finibus, consequat ac metus. Mauris tempor mattis mattis. Ut a porttitor urna. Nullam congue imperdiet tincidunt.',
          img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGhvdG9ncmFwaHl8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
          tags: [arts, health],
        },
        {
          avatarUrl: avatar3,
          author: 'Sarah Walker',
          title: 'Music and the Brain',
          date: currentDate,
          text: 'Vestibulum sit amet purus aliquam, suscipit ligula in, aliquet velit. Integer tempor eu ex a aliquam. Nulla facilisi. Curabitur accumsan consectetur odio, at posuere justo vulputate eget. Nam cursus dui nec massa laoreet, nec dictum erat vulputate. Proin eu nisi ac libero efficitur condimentum vel sit amet turpis. Vestibulum dignissim massa at massa efficitur, ac ultricies augue suscipit. Phasellus eu lacus odio. Vivamus tristique pulvinar elit at fermentum.',
          img: 'https://cdn.pixabay.com/photo/2016/11/29/03/35/beach-1867271__480.jpg',
          tags: [music],
        },
        {
          avatarUrl: avatar4,
          author: 'John Doe',
          title: 'COVID-19 Impact on Health',
          date: currentDate,
          text: 'Etiam sit amet lacus vehicula, tincidunt lectus et, suscipit eros. Curabitur dapibus odio id nisl vehicula, sit amet tempus libero ultrices. Fusce euismod purus nec urna pharetra, vel egestas metus laoreet. Donec aliquet mauris eget turpis aliquet, a tempor ex suscipit. Quisque dapibus risus metus, a rutrum felis volutpat ac. Vestibulum ut odio pharetra, venenatis lacus et, iaculis nisi. In at mauris lacinia, pellentesque felis a, fermentum odio. In feugiat justo a dolor elementum, ut fringilla ligula dignissim. Praesent nec tincidunt augue. Aliquam erat volutpat.',
          img: 'https://cdn.pixabay.com/photo/2019/09/16/11/51/sunset-4486622__480.jpg',
          tags: [health],
        },
        {
          avatarUrl: avatar3,
          author: 'Jack Hannah',
          title: 'Sed sed sodales erat',
          date: currentDate,
          text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper ipsum luctus bibendum tempus. Curabitur lacinia justo vitae egestas aliquet. Morbi convallis congue felis, eu pulvinar nulla finibus in. Praesent imperdiet velit nibh, consectetur varius ipsum mattis non. Maecenas dictum, nunc at vestibulum pulvinar, velit ipsum sodales ex, id vehicula felis velit ut quam. Curabitur vulputate commodo sapien ac facilisis. Praesent erat eros, porta ut faucibus eget, rhoncus quis nisi. Suspendisse potenti. Sed rhoncus, ex eu condimentum finibus, lacus ex bibendum orci, sit amet volutpat lacus lacus sit amet lorem. Donec laoreet eros at mollis tincidunt. Maecenas lectus velit, efficitur non dictum sed, fringilla ut lacus. In at placerat lorem, quis elementum dui. Cras urna nisi, luctus ut urna id, placerat eleifend tellus. Donec tempor purus est, non dictum nibh suscipit non.',
          img: 'https://images.picxy.com/cache/2019/10/6/0bca60f406919721cf446d0db958b300.jpg',
          tags: [health],
        },
        {
          avatarUrl: avatar4,
          title: 'Integer a nisl nisl',
          author: 'Colin Falls',
          date: currentDate,
          text: 'Integer a nisl nisl. Cras lobortis, velit vitae vulputate mollis, sem est gravida nisl, in dapibus tellus lacus quis elit. Sed non tellus facilisis, lobortis purus a, auctor lorem. Donec maximus volutpat odio, ut vulputate mi porta eget. Donec ac interdum massa, non maximus ipsum. Etiam porttitor a turpis nec ultricies. Etiam porttitor dui non leo lobortis aliquet.',
          img: 'https://www.w3schools.com/howto/img_nature_wide.jpg',
          tags: [music, health],
        },
        {
          avatarUrl: avatar1,
          author: 'Dr. Dan Reed',
          title: 'Mauris non fermentum justo',
          date: currentDate,
          text: 'Mauris non fermentum justo. Ut iaculis lacinia faucibus. Pellentesque nec leo id ligula ultrices lacinia in sit amet mi. Nullam magna tortor, ultrices et pretium sed, finibus in nisi. Suspendisse finibus quam eu justo fermentum volutpat. Aenean at molestie ligula. Pellentesque egestas luctus feugiat. Sed auctor convallis orci sit amet dictum. Nulla semper faucibus arcu ut sodales. Aenean ut eros sed nulla posuere imperdiet nec vitae quam. Nunc tincidunt faucibus enim. Ut pharetra malesuada lacus in faucibus.',
          img: 'https://images.ctfassets.net/hrltx12pl8hq/61DiwECVps74bWazF88Cy9/2cc9411d050b8ca50530cf97b3e51c96/Image_Cover.jpg?fit=fill&w=560&h=200',
          tags: [arts],
        },
        {
          avatarUrl: avatar2,
          author: 'Jordan Howard',
          title: 'In sem sapien',
          date: currentDate,
          text: 'Phasellus dapibus massa at felis vehicula, id dictum leo eleifend. Vivamus luctus felis semper arcu tempus pretium. Aliquam erat volutpat. Proin venenatis cursus nisl, vel dapibus felis imperdiet sed. Nam ac suscipit justo. Nullam et rutrum ante. Nam at orci et mi scelerisque sagittis a eget mauris.',
          img: 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
          tags: [arts],
        },
        {
          avatarUrl: avatar3,
          author: 'Jack Hannah',
          title: 'Nam ac suscipit justo',
          date: currentDate,
          text: 'In sem sapien, auctor non diam vel, tincidunt ornare mi. Mauris urna leo, aliquet id justo vitae, malesuada varius massa. Sed sodales, ligula ac congue luctus, purus justo commodo sapien, vel mollis mauris turpis vel est. In ut sem dignissim, congue ante et, facilisis ante. Pellentesque dignissim enim a est bibendum mollis. Vestibulum suscipit eu lacus eget venenatis. Duis eu metus eleifend, elementum lorem eu, semper tellus. Cras euismod risus a lobortis tincidunt.',
          img: 'https://thumbs.dreamstime.com/b/%D0%B4%D0%B5%D0%BD%D1%8C-%D0%B7%D0%B5%D0%BC%D0%BB%D0%B8-%D0%BE%D0%BA%D1%80%D1%83%D0%B6%D0%B0%D1%8E%D1%89%D0%B5%D0%B9-%D1%81%D1%80%D0%B5%D0%B4%D1%8B-%D0%B2-%D1%80%D1%83%D0%BA%D0%B0%D1%85-%D0%B4%D0%B5%D1%80%D0%B5%D0%B2%D1%8C%D0%B5%D0%B2-%D1%80%D0%B0%D1%81%D1%82%D1%8F-%D1%81%D0%B0%D0%B6%D0%B5%D0%BD%D1%86%D1%8B-bokeh-130247647.jpg',
          tags: [arts, health],
        },
        {
          avatarUrl: avatar4,
          author: 'Colin Falls',
          title: 'Aliquam sollicitudin',
          date: currentDate,
          text: 'Pellentesque tempor sem a dictum dignissim. Vestibulum dapibus et est vehicula posuere. Sed pretium sem eget massa porta sollicitudin. Duis malesuada neque lorem, sit amet molestie tortor volutpat nec. Sed et rhoncus lacus, ut eleifend nibh. Aliquam euismod justo eu euismod pretium. Etiam rhoncus sapien vitae justo porttitor lobortis. Pellentesque vitae vehicula nibh, nec tristique leo. Praesent in orci sapien. Duis nisi risus, commodo pulvinar vulputate sollicitudin, viverra ac metus.',
          img: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__480.jpg',
          tags: [arts, music],
        },
      ]);
    }, 1000);
  });
};
