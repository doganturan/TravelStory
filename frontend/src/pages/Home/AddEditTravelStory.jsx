import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/Input/DateSelector'
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput'
import moment from 'moment';
import axiosInstance from "../../utils/axiosInstance";
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-toastify';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {

    const [error, setError] = useState("")
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;

        try {
            let imageUrl = "";

            let postData = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
            }

            if (typeof storyImg === "object") {
                // Upload new image
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";

                postData = {
                    ...postData,
                    imageUrl: imageUrl,

                }
            }

            const response = await axiosInstance.put("/edit-travel-story/" + storyId, postData)

            if (response.data && response.data.story) {
                toast.success("Story updated successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("An unexpected error occured! Please try again.");
            }
        }
    }

    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";
            if (storyImg) {
                const imgUploadRes = await uploadImage(storyImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf()
            })

            if (response.data && response.data.story) {
                toast.success("Story added successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
            else {
                setError("An unexpected error occured! Please try again.");
            }
        }
    }

    const handleAddOrUpdateClick = () => {
        console.log("Data: ", { title, storyImg, story, visitedLocation, visitedDate });

        if (!title || !story) {
            setError('Please fill in all fields!');
            return;
        }

        setError("");
        if (type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }
    }

    const handleDeleteStoryImage = async () => {
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: storyInfo.imageUrl
            }
        });

        if (deleteImgRes.data) {
            const storyId = storyInfo._id;

            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl: ""
            };

            // Updating story
            const response = await axiosInstance.put("/edit-story/" + storyId, postData);
            setStoryImg(null);
        }
    }

    return (
        <div className='relative'>
            <div className="flex items-center justify-between">
                <h5 className="text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {
                        type === 'add' ?
                            <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                <MdAdd className='text-lg' /> Add Story
                            </button>
                            :
                            <>
                                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                    <MdUpdate className='text-lg' /> Update Story
                                </button>
                            </>
                    }

                    <button className="" onClick={onClose}>
                        <MdClose className='text-xl text-slate-400 ' />
                    </button>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
            )}

            <div>
                <div className="flex-1 flex flex-col gap-2 pt-4">
                    <label className="input-label"> TITLE </label>
                    <input className='text-2xl text-slate-950 outline-none' placeholder='A day at the great wall' type="text" value={title} onChange={({ target }) => setTitle(target.value)} />

                    <div className="my-3">
                        <label className='input-label'>DATE</label>
                        <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>

                    <label className='input-label'>IMAGE</label>
                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImage={handleDeleteStoryImage} />

                    <div className="flex flex-col gap-2 mt-4">
                        <label className='input-label'>STORY</label>
                        <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Your story' rows={10} value={story} onChange={({ target }) => setStory(target.value)} />
                    </div>

                    <div className="pt-3">
                        <label className="input-label">VISITED LOCATIONS</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory