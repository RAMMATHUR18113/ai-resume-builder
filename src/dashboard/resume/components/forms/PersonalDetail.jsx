import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.attributes) {
      setFormData({
        firstName: resumeInfo.attributes.firstName || '',
        lastName: resumeInfo.attributes.lastName || '',
        jobTitle: resumeInfo.attributes.jobTitle || '',
        address: resumeInfo.attributes.address || '',
        phone: resumeInfo.attributes.phone || '',
        email: resumeInfo.attributes.email || ''
      });
    }
  }, [resumeInfo]);

  const handleInputChange = (e) => {
    enabledNext(false);
    const { name, value } = e.target;

    const updatedForm = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedForm);

    setResumeInfo((prev) => ({
      ...prev,
      attributes: {
        ...prev?.attributes,
        ...updatedForm,
      }
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!resumeInfo?.id) {
      toast.error("Resume ID is missing.");
      setLoading(false);
      return;
    }

    const data = { data: formData };

    try {
      const resp = await GlobalApi.UpdateResumeDetail(resumeInfo?.id, data);
      console.log("✅ Updated:", resp);
      toast.success("Details updated");
      enabledNext(true);
    } catch (error) {
      console.error("❌ Update failed", error);
      toast.error("Failed to update. Try again./n"+error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Personal Detail</h2>
      <p>Get Started with the basic information</p>

      <form onSubmit={onSave}>
        <div className='grid grid-cols-2 mt-5 gap-3'>
          <div>
            <label className='text-sm'>First Name</label>
            <Input
              name="firstName"
              value={formData.firstName || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Last Name</label>
            <Input
              name="lastName"
              value={formData.lastName || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Job Title</label>
            <Input
              name="jobTitle"
              value={formData.jobTitle || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div className='col-span-2'>
            <label className='text-sm'>Address</label>
            <Input
              name="address"
              value={formData.address || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Phone</label>
            <Input
              name="phone"
              value={formData.phone || ''}
              required
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className='text-sm'>Email</label>
            <Input
              name="email"
              value={formData.email || ''}
              required
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className='mt-3 flex justify-end'>
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default PersonalDetail;
