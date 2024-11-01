import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';
import EmptyCard from '../../components/Cards/EmptyCard';
import EmptyImg from '../../assets/images/placeholder.png'


const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: 'add',
        data: null
    })

    const [openViewModal, setOpenViewModal] = useState({
        isShown: false,
        data: null
    });


    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }

    // Get All Travel Stories
    const getAllTravelStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-stories");
            if (response.data && response.data.stories) {
                setAllStories(response.data.stories);
            }
        } catch (error) {
            console.log("Unexpected error occured. Please try again!");
        }
    }

    // Handle Edit Story Click
    const handleEdit = async (data) => {
        setOpenAddEditModal({ isShown: true, type: 'edit', data: data })
    }

    // Handle Travel Story Click
    const handleViewStory = async (data) => {
        setOpenViewModal({
            isShown: true,
            data
        })
    }

    // Handle update favorite
    const updateIsFavorite = async (storyData) => {
        const storyId = storyData._id;

        try {
            const response = await axiosInstance.put("/update-is-favorite/" + storyId, {
                isFavorite: !storyData.isFavorite
            })

            if (response.data && response.data.story) {
                toast.success("Story added to favorites");
                getAllTravelStories();
            }
        } catch (error) {
            console.log("Unexpected error occured. Please try again!");
        }
    }

    // Delete Story
    const deleteTravelStory = async (data) => {
        const storyId = data._id;

        try {
            const response = await axiosInstance.delete("/delete-travel-story/" + storyId);
            if (response.data && !response.data.error) {
                toast.error("Story deleted successfully");
                setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
                getAllTravelStories();
            }

        } catch (error) {
            console.log('An unexpected error occured! Please try again.');
        }
    }

    useEffect(() => {
        getUserInfo();
        getAllTravelStories();
    }, []);

    return (
        <div>
            <Navbar userInfo={userInfo} />

            <div className="container mx-auto py-10">
                <div className='flex gap-7'>
                    <div className="flex-1">
                        {allStories.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {allStories.map((item) => {
                                    return (
                                        <TravelStoryCard onClick={() => handleViewStory(item)} onFavoriteClick={() => updateIsFavorite(item)} key={item._id} imageUrl={item.imageUrl} title={item.title} story={item.story} date={item.visitedDate} visitedLocation={item.visitedLocation} isFavorite={item.isFavorite} />
                                    )
                                })}
                            </div>
                        ) : (
                            <EmptyCard imgSrc={EmptyImg} message={"Start creating your first Travel Story! Click the Add button to write your thoughts, ideas, and memories. Let's get started!"} />
                        )}
                    </div>

                    <div className="w-[320px]">

                    </div>
                </div>
            </div>

            {/* Edit Travel Story Modal */}
            <Modal className="model-box" style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999 } }} appElement={document.getElementById("root")} isOpen={openAddEditModal.isShown} onRequestClose={() => { }} >
                <AddEditTravelStory type={openAddEditModal.type} storyInfo={openAddEditModal.data} onClose={() => { setOpenAddEditModal({ isShown: false, type: 'add', data: null }) }} getAllTravelStories={getAllTravelStories} />
            </Modal>

            {/* View Travel Story Modal */}
            <Modal className="model-box" style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999 } }} appElement={document.getElementById("root")} isOpen={openViewModal.isShown} onRequestClose={() => { }} >
                <ViewTravelStory storyInfo={openViewModal.data || null} onClose={() => { setOpenViewModal((prevState) => ({ ...prevState, isShown: false })) }} onEditClick={() => { setOpenViewModal((prevState) => ({ ...prevState, isShown: false })); handleEdit(openViewModal.data || null) }} onDeleteClick={() => { deleteTravelStory(openViewModal.data || null) }} />
            </Modal>

            <button className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10" onClick={() => { setOpenAddEditModal({ isShown: true, type: 'add', data: null }) }}>
                <MdAdd className="text-[32px] text-white" />
            </button>
            <ToastContainer />
        </div>
    )
}

export default Home