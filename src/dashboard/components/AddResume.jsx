import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("dev");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onCreate = async () => {
    setLoading(true);
    const uuid = uuidv4();
    const data = {
      data: {
        title: resumeTitle,
        resumeId: uuid,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName
      }
    };

    console.log("Sending data to Strapi:", data);

    try {
      const resp = await GlobalApi.CreateNewResume(data);
      console.log("✅ Resume created:", resp.data);
      setLoading(false);


      const resumeId = resp.data?.data?.resumeId;
      // console.log("*"*50)
      // console.log(resp.data?.data)
      // console.log("*"*50)
      // resp.data?.data?.attributes?.resumeId;

      if (resumeId) {
        navigate('/dashboard/resume/' + resumeId + "/edit");
      } else {
        // alert("Something went wrong. Couldn't get resumeId from response.\n");
        alert(JSON.stringify(resp?.data?.data,null, 2));
      }
    } catch (error) {
      setLoading(false);
      const err = error.response?.data?.error;

      console.error("❌ Error from Strapi:", JSON.stringify(err, null, 2));

        alert("Resume creation failed:\n" + err?.message);
   
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <div
            className='p-14 py-24 border 
              items-center flex 
              justify-center bg-secondary
              rounded-lg h-[280px]
              hover:scale-105 transition-all hover:shadow-md
              cursor-pointer border-dashed'
            onClick={() => setOpenDialog(true)}
          >
            <PlusSquare />
          </div>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume
              <Input
                className="my-2"
                placeholder="Ex. Full Stack Resume"
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className='flex justify-end gap-5'>
              <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
              <Button
                disabled={!resumeTitle || loading}
                onClick={onCreate}>
                {loading ?
                  <Loader2 className='animate-spin' /> : 'Create'
                }
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
