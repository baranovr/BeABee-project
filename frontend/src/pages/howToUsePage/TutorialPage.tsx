import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import * as S from './TutorialPage.styles';

const TutorialPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{'Tutorial'}</PageTitle>
      <BaseRow>
        <BaseCol span={24}>
          <S.TutorialBox>
            <S.SectionTitle>GENERAL TUTORIAL</S.SectionTitle>
            <S.SectionTitle>-</S.SectionTitle>
            <S.Overview>PAGES OVERVIEW</S.Overview>
            <S.SectionText>
              This guide will help you get started with our platform. Below you’ll find the essential steps to make your
              to make your experience seamless and productive.
            </S.SectionText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>1. Account management</S.SectionSubTitle>
            <S.SectionText>
              After registration you should visit your profile. To do that you need to click on your avatar in the
              header ➡️ Profile.
              <S.Pass>/</S.Pass>
              <S.SectionSub_1_Text>In you profile you can:</S.SectionSub_1_Text>
              <S.SectionListText>☑️ Change information about you.</S.SectionListText>
              <S.SectionSubListYellowText>
                ⚠️ Nickname, first name, last name and email must be unique for all users.
              </S.SectionSubListYellowText>
              <S.SectionListText>☑️ Change your avatar by click on your current avatar.</S.SectionListText>
              <S.SectionListText>☑️ Check and delete your own created objects.</S.SectionListText>
              <S.SectionSub_Red_Text>But:</S.SectionSub_Red_Text>
              <S.SectionYouCannot>
                ❌ You are not able to change your status in service (only other admins and creators can increase it).
              </S.SectionYouCannot>
              <S.SectionYouCannot>
                ❌ You will not be able to recover your password if you forget it.
              </S.SectionYouCannot>
            </S.SectionText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>2. Main Page</S.SectionSubTitle>
            <S.SectionText>
              On the left sidebar you can see all available pages. Now lets talk about main page.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionSub_1_Text>In this page you can:</S.SectionSub_1_Text>
            <S.SectionListText>☑️ See all registered users in our platform (on the left side).</S.SectionListText>
            <S.SectionSubListText>
              ➡️ By click on user name, you are able to view all information about them.
            </S.SectionSubListText>
            <S.SectionListText>
              ☑️ Scroll the carousel of news (named News). You can view all news by click on View all button.
            </S.SectionListText>
            <S.SectionListText>
              ☑️ The same functionality has carousel of important infos (named Whats important?).
            </S.SectionListText>
            <S.SectionListText>
              ☑️ On the map you can set you location on the planet. That location doesnt connected with your profile
              information.
            </S.SectionListText>
            <S.SectionSubSubWarnListText>
              ⚠️ You are not able to delete you location after creation. Only to change.
            </S.SectionSubSubWarnListText>
            <S.SectionListText>
              ☑️ By click on Load Latest Activities button you can see latest activities on the platform.
            </S.SectionListText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>3. Teachers Page</S.SectionSubTitle>
            <S.SectionText>
              What does Teachers Page mean? Do teachers live there? Do teachers... HAVE ACCOUNTS ON THE PLATFORM???
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionSub_1_Text>Obviously they dont). Teachers Page has 4 main components:</S.SectionSub_1_Text>
            <S.SectionListText>📍 Homework types popularity chart:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➪ All homework assignments are divided into three types: Math/Physics, Prog/Networks and Lang/Culture.
            </S.SectionSubListInfoText>
            <S.SectionSubListInfoText>
              ➪ On the chart you can switch the type of homework, teacher and see who and how many assignments were
              given for the selected month.
            </S.SectionSubListInfoText>
            <S.Pass>/</S.Pass>
            <S.SectionListText>📍 Exam schedule:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➪ This schedule shows when and what exams await you in a convenient calendar format.
            </S.SectionSubListInfoText>
            <S.Pass>/</S.Pass>
            <S.SectionListText>📍 All teachers carousel:</S.SectionListText>
            <S.SectionSubListInfoText>➪ Just a carousel with information about each teacher.</S.SectionSubListInfoText>
            <S.Pass>/</S.Pass>
            <S.SectionListText>📍 Homeworks:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➪ By click on Load Homeworks button, you are able to load all existing homeworks.
            </S.SectionSubListInfoText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>4. Apps➰Feed</S.SectionSubTitle>
            <S.SectionText>
              Yes, this platform has the beginnings of a social network ;) Note: only beginnings! No likes, no comments,
              no tags etc. BeABee != Instagram.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionSub_1_Text>On this page you can:</S.SectionSub_1_Text>
            <S.SectionListText>☑️ Scroll (default for social networks) feed.</S.SectionListText>
            <S.SectionSubSubWarnListText>
              ⚠️ This is the only place where you can view posts with photos and no extra fluff.
            </S.SectionSubSubWarnListText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>5. Data Tables: Students | Teachers | Subjects | Homeworks</S.SectionSubTitle>
            <S.SectionText>
              So-called tables are created to quickly obtain a large amount of information in a structured form.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionSub_1_Text>Lets start in order:</S.SectionSub_1_Text>
            <S.SectionListText>📋 In Students table you can:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➱ View the list of all existing students (who is already in service and who is not).
            </S.SectionSubListInfoText>
            <S.SectionSubSubRedListText>
              ❌ Users in table created manually. They havent any connections with users in service.
            </S.SectionSubSubRedListText>
            <S.SectionSubListInfoText>➱ Filter users by last name and group.</S.SectionSubListInfoText>
            <S.SectionSubListInfoText>➱ Manage pagination and number of displayed objects.</S.SectionSubListInfoText>

            <S.Pass>/</S.Pass>

            <S.SectionListText>📋 In Teachers table you can:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➱ View the list of all existing teachers (with their emails and subjects).
            </S.SectionSubListInfoText>
            <S.SectionSubSubGreenListText>✅ Teachers in table created automatically.</S.SectionSubSubGreenListText>
            <S.SectionSubListInfoText>➱ Filter users by last name, first name and surname.</S.SectionSubListInfoText>
            <S.SectionSubListInfoText>➱ Manage pagination and number of displayed objects.</S.SectionSubListInfoText>

            <S.Pass>/</S.Pass>

            <S.SectionListText>📋 In Subjects table you can:</S.SectionListText>
            <S.SectionSubListInfoText>
              ➱ View the list of all existing subjects (oddly enough :) ).
            </S.SectionSubListInfoText>
            <S.SectionSubSubGreenListText>✅ Subjects in table created automatically.</S.SectionSubSubGreenListText>
            <S.SectionSubListInfoText>➱ Filter users by name and group.</S.SectionSubListInfoText>
            <S.SectionSubListInfoText>➱ Manage pagination and number of displayed objects.</S.SectionSubListInfoText>

            <S.Pass>/</S.Pass>

            <S.SectionListText>📋 In Homeworks table you can:</S.SectionListText>
            <S.SectionSubListInfoText>➱ View the list of all existing homeworks.</S.SectionSubListInfoText>
            <S.SectionSubSubGreenListText>✅ Homeworks in table created automatically.</S.SectionSubSubGreenListText>
            <S.SectionSubListInfoText>
              ➱ Filter users by existing subjects, teachers, their deadlines and corresponding groups.
            </S.SectionSubListInfoText>
            <S.SectionSubListYellowText>
              ⚠️ By click on + button or directly on element, you can view description of homework.
            </S.SectionSubListYellowText>
            <S.SectionSubListInfoText>➱ Manage pagination and number of displayed objects.</S.SectionSubListInfoText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.Overview>HOW TO CREATE / PERMISSIONS</S.Overview>
            <S.SectionText>
              Lets talk about how to create objects in platform. Naturally, while following the rule of protect yourself
              from not-so-smart people, there are some conditions and limitations.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.SectionSubTitle>6. How to create</S.SectionSubTitle>
            <S.SectionText>On the platform, users can create a total of 8 different objects:</S.SectionText>
            <S.SectionListText>➢ News</S.SectionListText>
            <S.SectionListText>➢ Important info</S.SectionListText>
            <S.SectionListText>➢ Post</S.SectionListText>
            <S.SectionListText>➢ Homework</S.SectionListText>
            <S.SectionListText>➢ Subject</S.SectionListText>
            <S.SectionListText>➢ Teacher</S.SectionListText>
            <S.SectionListText>➢ Exam</S.SectionListText>
            <S.SectionListText>➢ Student (for table)</S.SectionListText>
            <S.Pass>/</S.Pass>
            <S.SectionText>
              To create all of them you should click on button on the header which looks like a pen.
            </S.SectionText>
            <S.SectionText>
              To create student for table you should go to Data Table ➡️ Students ➡️ click on a + button.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.SectionSubTitle>7. Permissions</S.SectionSubTitle>
            <S.SectionText>Like you may understood, BeABee based on the 3 permission statuses:</S.SectionText>
            <S.SectionListText>Creator 👑</S.SectionListText>
            <S.SectionListText>Admin 🔴️</S.SectionListText>
            <S.SectionListText>User 🔵</S.SectionListText>

            <S.Pass>/</S.Pass>

            <S.SectionListText>📍Creators and Admins:</S.SectionListText>
            <S.SectionSubSubGreenListText>✅ Can create / delete all objects.</S.SectionSubSubGreenListText>
            <S.SectionSubSubGreenListText>✅ Can create / update / delete students.</S.SectionSubSubGreenListText>
            <S.SectionListText>📍Users:</S.SectionListText>
            <S.SectionSubSubRedListText>❌ Cannot create / delete homeworks.</S.SectionSubSubRedListText>
            <S.SectionSubSubRedListText>❌ Cannot create / delete subjects.</S.SectionSubSubRedListText>
            <S.SectionSubSubRedListText>❌ Cannot create /delete teachers.</S.SectionSubSubRedListText>
            <S.SectionSubSubRedListText>❌ Cannot create /delete exams.</S.SectionSubSubRedListText>
            <S.SectionSubSubRedListText>❌ Cannot create / update / delete students.</S.SectionSubSubRedListText>
            <S.Pass>/</S.Pass>
            <S.Note>
              🚫 You cannot increase your status yourself. It can only be increased by a user who has a higher status
              than you!
            </S.Note>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.SectionSubTitle>Need Help?</S.SectionSubTitle>
            <S.SectionText>
              If you encounter any issues, visit our FAQ or contact support for assistance. (Its joking, everything is
              ok, just read tutorials better 🙂)
            </S.SectionText>
          </S.TutorialBox>
        </BaseCol>
      </BaseRow>

      <BaseRow>
        <BaseCol span={24}>
          <S.TutorialBox>
            <S.SectionTitle>TUTORIAL FOR ADMINISTRATORS</S.SectionTitle>
            <S.SectionTitle>-</S.SectionTitle>
            <S.Overview>USER BAN SYSTEM</S.Overview>
            <S.SectionText>
              If you are reading this, then your status level is Admin. Now lets talk about the ban system.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>1. Ban user</S.SectionSubTitle>
            <S.SectionText>
              To ban user you should go to the Main Page, find list All Users In Service and click on the victims
              avatar.
            </S.SectionText>
            <S.SectionListText>✏️ Ban interface:</S.SectionListText>
            <S.SectionSubListText>➡️ Ban interface has 3 different reasons:</S.SectionSubListText>
            <S.SectionSubSubPurListText>🔖 Insulting community members</S.SectionSubSubPurListText>
            <S.SectionSubSubPurListText>🔖 Publishing obscene content</S.SectionSubSubPurListText>
            <S.SectionSubSubPurListText>🔖 Spam</S.SectionSubSubPurListText>
            <S.Pass>/</S.Pass>
            <S.Note>
              🚫 All bans are permanent (long story short - immediately, without the possibility of choosing a term)!
            </S.Note>
            <S.SectionText>
              Once you ban a user, everyone will be able to see who is banned (the user will have a BANNED mark). But no
              one will know who banned them 😊.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.SectionListText>🔐 Ban rules:</S.SectionListText>
            <S.SectionSubSubGreenListText>✅ Admins can ban users with status User.</S.SectionSubSubGreenListText>
            <S.SectionSubSubRedListText>❌ You cannot ban yourself (dont try it 😶).</S.SectionSubSubRedListText>
            <S.SectionText>To unban a user, follow the same instructions as for ban them.</S.SectionText>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.Overview>HOW TO INCREASE USER STATUS</S.Overview>
            <S.SectionText>The last question - how to increase user status in service?</S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionSubTitle>2. Increasing steps</S.SectionSubTitle>
            <S.SectionText>
              To increase user status you should go to the Main Page, find list All Users In Service and click on the
              user full name. Next you should click View Full Info button and choose new status.
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.SectionListText>📈 Increasing rules:</S.SectionListText>
            <S.SectionSubSubGreenListText>✅ Creators can increase status of everyone.</S.SectionSubSubGreenListText>
            <S.SectionSubSubRedListText>❌ Users cant increase status of anyone.</S.SectionSubSubRedListText>
            <S.SectionSubSubRedListText>
              ❌ Admins cant increase status of other admins or creators.
            </S.SectionSubSubRedListText>
            <S.SectionSubSubGreenListText>✅ Admins can increase status User to Admin.</S.SectionSubSubGreenListText>
            <S.Pass>/</S.Pass>
            <S.Note>🚫 If you upgrade a users status, you can never downgrade it again!</S.Note>

            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.SectionSubTitle>Need Help?</S.SectionSubTitle>
            <S.SectionText>
              If you encounter any issues, visit our FAQ or contact support for assistance. (Its joking, everything is
              ok, just read tutorials better 🙂)
            </S.SectionText>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>
            <S.Pass>/</S.Pass>

            <S.Overview>Thats all! Fair winds and following seas!</S.Overview>
          </S.TutorialBox>
        </BaseCol>
      </BaseRow>
    </>
  );
};

export default TutorialPage;
