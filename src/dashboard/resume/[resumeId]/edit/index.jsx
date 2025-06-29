import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';

function EditResume() {
  const { resumeId } = useParams(); // UUID from route
  const [resumeInfo, setResumeInfo] = useState();

  useEffect(() => {
    if (resumeId) {
      GetResumeInfo();
    }
  }, [resumeId]);

  const GetResumeInfo = async () => {
    try {
      const resp = await GlobalApi.GetResumeByResumeId(resumeId);
      const resumeData = resp.data?.data; // Get first match from response

      if (resumeData) {
        setResumeInfo({
          id: resumeData.id,                     // <- numeric Strapi ID
          attributes: resumeData.attributes      // <- all resume fields
        });
      } else {
        console.warn("Resume not found for resumeId:", resumeId);
      }
    } catch (err) {
      console.error("Error fetching resume by resumeId:", err);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
