import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../service/GlobalApi';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState();
  const { resumeId } = useParams();

  useEffect(() => {
    GetResumeInfo();
  }, []);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeByResumeId(resumeId).then((resp) => {
      const data = resp.data?.data;
      if (data) setResumeInfo(data); // only .attributes
    });
  };

  const HandleDownload = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${resumeInfo?.firstName || ''} ${resumeInfo?.lastName || ''} resume`,
          text: 'Hello! This is my resume. Please check it out:',
          url: `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`,
        })
        .then(() => console.log('✅ Shared successfully'))
        .catch((err) => console.error('❌ Share failed:', err));
    } else {
      alert('Sharing not supported in this browser.');
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your AI-generated Resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            You can download it or share your unique resume URL with others.
          </p>

          <div className="flex justify-between px-44 my-10">
            <Button onClick={HandleDownload}>Download</Button>
            <Button onClick={handleShare}>Share</Button>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
