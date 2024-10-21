import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/pages/inFuturePages/inFuturePages.styles';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';

const Card = styled(S.Card)`
  .ant-card-body {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ImageWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
`;

const PlansPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.plans')}</PageTitle>
      <BaseCol>
        <Card title="1. Websocket Chat">
          <h3>Online chat to make conversation between service members</h3>
          <ImageWrapper>
            <Image src="/assets/in-future-plans/plan-chat.png" alt="Photo" />
          </ImageWrapper>
        </Card>
      </BaseCol>
    </>
  );
};

export default PlansPage;
