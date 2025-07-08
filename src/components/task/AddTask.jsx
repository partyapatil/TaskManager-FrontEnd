import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
// import { app } from "../../utils/firebase";
import { toast } from "react-toastify";
// ...existing code...
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/taskApislice";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen,task }) => {
const [createTask, { isLoading }] = useCreateTaskMutation();
const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
//console.log(task)
const URLs = task?.assets ? [...task.assets] : [];

const uploadedFileURLs = [];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
  defaultValues: {
    title: task?.title || "",
    date: task?.date ? task.date.slice(0, 10) : "", // format for input[type="date"]
  },
});
  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);

  const submitHandler = async (data) => {
    //console.log("object");
    for (const file of assets) {
      setUploading(true);
      try {
        await uploadFile(file);
      } catch (error) {
        //console.error("Error uploading file:", error.message);
        return;
      } finally {
        setUploading(false);
      }
    }
    try {
      const newData = {
        ...data,
        assets: [...URLs, ...uploadedFileURLs],
        team,
        stage,
        priority,
      };

      const res = task?._id
        ? await updateTask({ ...newData, _id: task._id }).unwrap()
        : await createTask(newData).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      //console.error("Submit error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleSelect = (e) => {
    submitHandler();
    setAssets(e.target.files);
  };

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const fileRef = ref(storage, `task-assets/${file.name}-${Date.now()}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: you can handle progress here
      },
      (error) => {
        console.error("Upload failed:", error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        uploadedFileURLs.push(downloadURL);
        resolve(downloadURL);
      }
    );
  });
};
  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <UserList setTeam={setTeam} team={team} />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={stage}
                setSelected={setStage}
              />

              <div className="w-full">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", {
                    required: "Date is required!",
                  })}
                  error={errors.date ? errors.date.message : ""}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />

              <div className="w-full flex items-center justify-center mt-4">
                <label
                  className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4"
                  htmlFor="imgUpload"
                >
                  <input
                    type="file"
                    className="hidden"
                    id="imgUpload"
                    onChange={(e) => handleSelect(e)}
                    accept=".jpg, .png, .jpeg"
                    multiple={true}
                  />
                  <BiImages />
                  <span>Add Assets</span>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
              {uploading ? (
                <span className="text-sm py-2 text-red-500">
                  Uploading assets
                </span>
              ) : (
                <Button
                  label="Submit"
                  type="submit"
                  className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
                />
              )}

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
