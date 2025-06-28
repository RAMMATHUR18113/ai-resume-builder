import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import GlobalApi from '../../../../../service/GlobalApi'

function Education() {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [educationalList, setEducationalList] = useState([
    {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ]);

  useEffect(() => {
    if (resumeInfo?.attributes?.education) {
      setEducationalList(
        resumeInfo.attributes.education.length > 0
          ? resumeInfo.attributes.education
          : [
              {
                universityName: '',
                degree: '',
                major: '',
                startDate: '',
                endDate: '',
                description: ''
              }
            ]
      );
    }
  }, [resumeInfo]);

  const handleChange = (event, index) => {
    const newEntries = [...educationalList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
  };

  const AddNewEducation = () => {
    setEducationalList([
      ...educationalList,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]);
  };

  const RemoveEducation = () => {
    if (educationalList.length > 1) {
      setEducationalList((prev) => prev.slice(0, -1));
    }
  };

  const onSave = async () => {
    if (!resumeInfo?.id) {
      toast.error('Resume ID not found!');
      return;
    }

    setLoading(true);

    const data = {
      data: {
        education: educationalList.map(({ id, ...rest }) => rest)
      }
    };

    try {
      const resp = await GlobalApi.UpdateResumeDetail(resumeInfo.id, data);
      console.log(resp);
      toast.success('Details updated!');
    } catch (error) {
      console.error(error);
      toast.error('Server Error. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      attributes: {
        ...prev?.attributes,
        education: educationalList
      }
    }));
  }, [educationalList]);

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add Your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input
                name="universityName"
                onChange={(e) => handleChange(e, index)}
                value={item?.universityName || ''}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input
                name="degree"
                onChange={(e) => handleChange(e, index)}
                value={item?.degree || ''}
              />
            </div>
            <div>
              <label>Major</label>
              <Input
                name="major"
                onChange={(e) => handleChange(e, index)}
                value={item?.major || ''}
              />
            </div>
            <div>
              <label>Start Date</label>
              <Input
                type="date"
                name="startDate"
                onChange={(e) => handleChange(e, index)}
                value={item?.startDate || ''}
              />
            </div>
            <div>
              <label>End Date</label>
              <Input
                type="date"
                name="endDate"
                onChange={(e) => handleChange(e, index)}
                value={item?.endDate || ''}
              />
            </div>
            <div className='col-span-2'>
              <label>Description</label>
              <Textarea
                name="description"
                onChange={(e) => handleChange(e, index)}
                value={item?.description || ''}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewEducation} className="text-primary">+ Add More Education</Button>
          <Button variant="outline" onClick={RemoveEducation} className="text-primary">- Remove</Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Education;
