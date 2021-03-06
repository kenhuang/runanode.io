import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import theme, { colors, media } from 'theme';
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple';
import { faLinux } from '@fortawesome/free-brands-svg-icons/faLinux';
import { faWindows } from '@fortawesome/free-brands-svg-icons/faWindows';
import { Row, Col } from 'components';
import Link from 'components/Link';

import DownloadCards from './DownloadCards';

const Title = styled.div`
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 43px;
  text-align: center;
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 24px;
  margin: 0 auto;
  padding: 1rem 0;
  text-align: center;
`;

const VersionInfo = styled.div`
  height: 1.8rem;
  width: 24rem;
  background: ${theme.listitemHighlightGradient};
  line-height: 1.8rem;
  padding: 0 0.5rem;
  border-radius: 11rem;
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;

  ${media.smDown`
    height: 4rem;
    width: 16rem;
    flex-direction: column;
  `}
`;

const DesktopOnly = styled.div`
  padding: 1rem;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: transparent;

  ${media.mdDown`
    color: ${colors.N0};
  `}
`;

const VersionText = styled.div``;

const Download = ({ data: { github } }) => {
  if (!github) {
    return <div>There is no data</div>;
  }
  //   const markdown = props.data.allMarkdownRemark.edges;
  //   const json = props.data.allFeaturesJson.edges;

  const { name: releaseVersion, publishedAt } = github.repository.releases.edges[0].node;
  const latestReleaseDate = publishedAt && new Date(publishedAt).toDateString();
  const releaseAssets = github.repository.releases.edges[0].node.releaseAssets.edges;
  const releaseNotes =
    github.repository.releases.edges[0].node.releaseAssets.edges[0].node.release.description || '';

  const [downloadData, setDownloadData] = useState(null);
  const [appleCheckSum, setAppleCheckSum] = useState(null);
  const [linuxCheckSum, setLinuxCheckSum] = useState(null);

  useEffect(() => {
    let macDownloadLink = '';
    let linuxDownloadLink = '';
    let windowsDownloadLink = '';

    if (releaseAssets) {
      releaseAssets.forEach(releaseItem => {
        const { name } = (releaseItem && releaseItem.node) || '';
        const { url } = (releaseItem && releaseItem.node) || null;
        const { downloadUrl } = (releaseItem && releaseItem.node) || null;

        if (name.endsWith('mac.dmg') && downloadUrl) {
          macDownloadLink = downloadUrl;
        }

        // https://github.com/axios/axios/issues/853#issuecomment-412922608
        // https://github.com/Rob--W/cors-anywhere/
        const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';

        if (name.endsWith('mac.dmg.sha256') && downloadUrl) {
          axios.get(`${corsProxyUrl}` + downloadUrl).then(({ data }) => {
            const appleCheckSum = (data && data.substring(data.indexOf('=') + 1)) || '';

            setAppleCheckSum(appleCheckSum);
          });
        }

        if (name.endsWith('linux-x86_64.AppImage') && downloadUrl) {
          linuxDownloadLink = downloadUrl;
        }

        if (name.endsWith('linux-x86_64.AppImage.sha256') && downloadUrl) {
          axios.get(`${corsProxyUrl}` + downloadUrl).then(({ data }) => {
            const linuxCheckSum = (data && data.substring(data.indexOf('=') + 1)) || '';

            setLinuxCheckSum(linuxCheckSum);
          });
        }

        if (name.endsWith('.exe') && downloadUrl) {
          windowsDownloadLink = downloadUrl;
        }
      });
    }

    const resortedDownloadData = [
      { device: 'macOS 64 bit', url: macDownloadLink, checksum: appleCheckSum, logo: faApple },
      {
        device: 'Linux 64 bit',
        url: linuxDownloadLink,
        checksum: linuxCheckSum,
        logo: faLinux,
      },
      { device: 'Windows', url: windowsDownloadLink, logo: faWindows },
    ];

    setDownloadData(resortedDownloadData);
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xs={12} md={{ size: 8, offset: 2 }}>
          <Title>LET&#39;S RUN A NODE!</Title>
          <Description>
            Download node application to your computer from below list.
            <br />
            If you prefer to use CLI, please download
            <Link
              href="https://github.com/cennznet/cennznet-node-bin/releases"
              inline
              margin="0 0 0 0.5rem"
              underline
            >
              here
            </Link>
            .
          </Description>
          <VersionInfo>
            <VersionText>{`Current version ${releaseVersion}`}</VersionText>
            <VersionText>{`Release date: ${latestReleaseDate}`}</VersionText>
          </VersionInfo>
          <DesktopOnly>rUN Node is for desktop only</DesktopOnly>
        </Col>
      </Row>
      <DownloadCards downloadData={downloadData} releaseVersion={releaseVersion} />
    </React.Fragment>
  );
};

export default Download;
