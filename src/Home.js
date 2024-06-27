// src/Home.js
import React, { useEffect, useState } from 'react';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { awsConfig } from './aws-config';
import './App.css';

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const s3Client = new S3Client({
        region: awsConfig.region,
        credentials: {
          accessKeyId: awsConfig.accessKeyId,
          secretAccessKey: awsConfig.secretAccessKey,
        },
      });

      try {
        const command = new ListObjectsV2Command({
          Bucket: awsConfig.bucketName,
        });
        const response = await s3Client.send(command);
        const videoUrls = response.Contents.map(item => `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${item.Key}`);
        
        console.log('Video URLs:', videoUrls); // Debugging line
        
        setVideos(videoUrls);
      } catch (error) {
        console.error('Error fetching videos from S3:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="Home">
      <h2>WELCOME TO OUR AWESOME VIDEO STREAMING PLATFORM</h2>
      <div className="video-container">
        {videos.map((videoUrl, index) => (
          <div key={index} className="video-wrapper">
            <video controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
