import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { useParams } from 'react-router-dom'
import GlobalApi from '../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const defaultForm = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummery: '',
};

function Experience() {
  const [experienceList, setExperienceList] = useState([defaultForm]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);
  const { resumeId } = useParams();

  useEffect(() => {
    if (resumeInfo?.attributes?.Experience) {
      const exp = resumeInfo.attributes.Experience;
      setExperienceList(exp.length > 0 ? exp : [defaultForm]);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    const newEntries = [...experienceList];
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const handleRichTextEditor = (event, name, index) => {
    const newEntries = [...experienceList];
    newEntries[index][name] = event.target.value;
    setExperienceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, { ...defaultForm }]);
  };

  const RemoveExperience = () => {
    if (experienceList.length > 1) {
      setExperienceList((prev) => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      attributes: {
        ...prev?.attributes,
        Experience: experienceList,
      },
    }));
  }, [experienceList]);

  const onSave = async () => {
    if (!resumeInfo?.id) {
      toast.error("Resume ID not found!");
      return;
    }

    setLoading(true);

    const data = {
      data: {
        Experience: experienceList.map(({ id, ...rest }) => rest),
      },
    };

    try {
      const res = await GlobalApi.UpdateResumeDetail(resumeInfo.id, data);
      console.log(res);
      toast.success("Details updated!");
    } catch (err) {
      console.error(err);
      toast.error("Server Error. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Professional Experience</h2>
      <p>Add Your previous Job experience</p>
      <div>
        {experienceList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label className='text-xs'>Position Title</label>
              <Input name="title" onChange={(e) => handleChange(index, e)} value={item?.title || ''} />
            </div>
            <div>
              <label className='text-xs'>Company Name</label>
              <Input name="companyName" onChange={(e) => handleChange(index, e)} value={item?.companyName || ''} />
            </div>
            <div>
              <label className='text-xs'>City</label>
              <Input name="city" onChange={(e) => handleChange(index, e)} value={item?.city || ''} />
            </div>
            <div>
              <label className='text-xs'>State</label>
              <Input name="state" onChange={(e) => handleChange(index, e)} value={item?.state || ''} />
            </div>
            <div>
              <label className='text-xs'>Start Date</label>
              <Input type="date" name="startDate" onChange={(e) => handleChange(index, e)} value={item?.startDate || ''} />
            </div>
            <div>
              <label className='text-xs'>End Date</label>
              <Input type="date" name="endDate" onChange={(e) => handleChange(index, e)} value={item?.endDate || ''} />
            </div>
            <div className='col-span-2'>
              <RichTextEditor
                index={index}
                defaultValue={item?.workSummery}
                onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant="outline" onClick={AddNewExperience} className="text-primary">+ Add More Experience</Button>
          <Button variant="outline" onClick={RemoveExperience} className="text-primary">- Remove</Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Experience;
