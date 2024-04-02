/* eslint-disable import/order */
import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import GeneralSettings from './GeneralSettings';
import ManageFriends from './ManageFriends';
import Preferences from './Preferences';
import SettingsSideBar from './SettingsSideBar';
import UpdatePwd from './UpdatePwd';

function AccountSettings() {
  const [currentSetting, setCurrentSetting] =
    useState<SettingsSidebarProps['currentSetting']>('general-settings');

  const renderSettingContent = () => {
    switch (currentSetting) {
      case 'general-settings':
        return <GeneralSettings />;
      case 'friends':
        return <ManageFriends />;
      case 'change-password':
        return <UpdatePwd />;
      default:
        return <Preferences />;
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="w-100">
        <Col lg={3} xl={3}>
          <SettingsSideBar
            currentSetting={currentSetting}
            setCurrentSetting={setCurrentSetting}
          />
        </Col>
        <Col lg={9} xl={9}>
          {renderSettingContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default AccountSettings;
