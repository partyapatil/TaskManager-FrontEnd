import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import { toast } from "react-toastify";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../../redux/slices/TaskApisliceMutation";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORIRY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];

const AddTask = ({ open, setOpen, task }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      date: task?.date ? task.date.slice(0, 10) : "",
    },
  });

  const [team, setTeam] = useState(task?.team || []);
  const [stage, setStage] = useState(task?.stage?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );
  const [assets, setAssets] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState(task?.assets || []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAssets(files);
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const newUploadedFiles = [];
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "TaskFiles");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ddpunpqre/raw/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        if (res.ok && data.secure_url) {
          newUploadedFiles.push(data.secure_url);
        } else {
          throw new Error(data.error?.message || "File upload failed");
        }
      }
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      return newUploadedFiles;
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (data) => {
    try {
      let newUploads = [];
      if (assets.length > 0) {
        newUploads = await uploadFiles(assets);
      }

      const taskData = {
        ...data,
        assets: [...uploadedFiles, ...newUploads],
        team,
        stage,
        priority,
      };

      const res = task?._id
        ? await updateTask({ ...taskData, _id: task._id }).unwrap()
        : await createTask(taskData).unwrap();

      toast.success(res.message);
      
      // Reset form and close modal
      reset();
      setTeam([]);
      setAssets([]);
      setUploadedFiles([]);
      setOpen(false);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.data?.message || "Something went wrong!");
    }
  };

  const handleClose = () => {
    reset();
    setTeam([]);
    setAssets([]);
    setUploadedFiles([]);
    setOpen(false);
  };

  return (
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
                  onChange={handleFileSelect}
                  multiple={true}
                />
                <BiImages />
                <span>Add Assets</span>
              </label>
            </div>
          </div>

          {assets.length > 0 && (
            <div className="text-sm text-gray-500">
              {assets.length} file(s) selected for upload
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="text-sm text-gray-500">
              {uploadedFiles.length} file(s) already uploaded
            </div>
          )}

          <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4">
            <Button
              label={uploading ? "Uploading..." : "Submit"}
              type="submit"
              className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
              disabled={uploading || isLoading || isUpdating}
            />

            <Button
              type="button"
              className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
              onClick={handleClose}
              label="Cancel"
              disabled={uploading}
            />
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default AddTask;