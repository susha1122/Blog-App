import { useUser, useAuth } from "@clerk/clerk-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import {toast} from 'react-toastify' 
import { useNavigate } from "react-router-dom"



const PostMenuActions = ({post}) => {
    const {user} = useUser()
    const {getToken} = useAuth()
    const navigate = useNavigate()

    const { isPending, error, data:savedPosts } = useQuery({
        queryKey: ["savedPosts"],
        queryFn: async ()=> {
            const token = await getToken()
            return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            })
        },
    });

    const isAdmin = user?.publicMetadata?.role === "admin" || false;

    const isSaved = savedPosts?.data?.some(p => p === post._id) || false;

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        onSuccess:()=>{
            toast.success("Post delete successfully!")
            navigate("/")
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    })

    const queryClient = useQueryClient()
    
    const saveMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.patch(`${import.meta.env.VITE_API_URL}/users/save`,{
                postId: post._id,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey: ["savedPosts"]})
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    })

    const featureMutation = useMutation({
        mutationFn: async () => {
            const token = await getToken();
            return axios.patch(`${import.meta.env.VITE_API_URL}/posts/feature`,{
                postId: post._id,
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey: ["post", post.slug]})
        },
        onError: (error) => {
            toast.error(error.response.data);
        },
    })



    const handleDelete = () => {
        deleteMutation.mutate();
    }

    const handleFeature = () => {
        featureMutation.mutate();
    }

    const handleSave = () => {
        if(!user){
            return navigate("/login")
        }
        saveMutation.mutate();
    }

    

    return (
        <div>
            <h1 className='mt-8 mb-4 text-sm font-medium'>Action</h1>
            {isPending ? "Loading..." : error ? "Saved post fetching failed!" : (<div className='flex items-center gap-2 py-2 text-sm cursor-pointer' onClick={handleSave}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="20px"
                    height="20px"
                    >
                    <path
                        d="M12 4h24c1.7 0 3 1.3 3 3v34l-15-9-15 9V7c0-1.7 1.3-3 3-3z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill={saveMutation.isPending ? isSaved ? "none" : "black" : isSaved ? "black" : "none"}
                    />
                </svg>
                <span>Save this Post</span>
                {saveMutation.isPending && (<span className="text-xs">(in progress)</span>)}
            </div>
        )}
            {isAdmin && (
                <div className="flex items-center gap-2 py-2 text-sm cursor-pointer" onClick={handleFeature}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="20px"
                        height="20px"
                    >
                        <path
                            d="M24 2L29.39 16.26L44 18.18L33 29.24L35.82 44L24 37L12.18 44L15 29.24L4 18.18L18.61 16.26L24 2Z"
                            stroke="black"
                            strokeWidth="2"
                            fill= {featureMutation.isPending ? post.isFeatured ? "none" : "black" : post.isFeatured ? "black" : "none"}
                        />
                    </svg>
                    <span>Feature</span>
                    {featureMutation.isPending && (<span className="text-xs">(in progress)</span>)}
                </div>
            )}
            {user && (post.user.username === user.username || isAdmin) && (<div className='flex items-center gap-2 py-2 text-sm cursor-pointer' onClick={handleDelete}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 50 50'
                    fill="red"
                    width="20px"
                    height="20px"
                >
                    <path
                        d='M21 2c-1.65 0-3 1.35-3 3v2h-8c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1h28c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1h-8V5c0-1.65-1.35-3-3-3h-6zM12 14v28c0 2.2 1.8 4 4 4h18c2.2 0 4-1.8 4-4V14H12zm8 4c.55 0 1 .45 1 1v18c0 .55-.45 1-1 1s-1-.45-1-1V19c0-.55.45-1 1-1zm10 0c.55 0 1 .45 1 1v18c0 .55-.45 1-1 1s-1-.45-1-1V19c0-.55.45-1 1-1z'
                    />
                </svg>
                <span>Delete this Post</span>
                {deleteMutation.isPending && <span className="text-xs">(in progress)</span>}
            </div>)}
        </div>
    )
}

export default PostMenuActions