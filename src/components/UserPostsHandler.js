import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useLiveUserPosts = (page, userBearerToken) => {
  const sessionPosts = JSON.parse(sessionStorage.getItem("userPosts")) || {};
  const sessionReplies = JSON.parse(sessionStorage.getItem("userReplies")) || {};

  const [userPosts, setUserPosts] = useState(sessionPosts);
  const [userReplies, setUserReplies] = useState(sessionReplies);

  const [isLoading, setIsLoading] = useState(() => {
     return !sessionPosts[page] || sessionPosts[page].length === 0;
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchPostsAndReplies = async () => {
      try {
        const postRes = await axios.get(
          `https://supabase-socmed.vercel.app/post?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${userBearerToken}`,
            },
          }
        );

        const posts = postRes.data;

        if (isMounted.current) {
          setUserPosts((prev) => {
            const updated = {
              ...prev,
              [page]: posts,
            };
            sessionStorage.setItem("userPosts", JSON.stringify(updated));
            return updated;
          });
        }

        const replyResults = await Promise.all(
          posts.map((post) =>
            axios
              .get(`https://supabase-socmed.vercel.app/post/${post.id}`, {
                headers: {
                  Authorization: `Bearer ${userBearerToken}`,
                },
              })
              .then((res) => ({ id: post.id, data: res.data }))
              .catch((err) => {
                console.error(`Failed to fetch replies for post ${post.id}:`, err);
                return null;
              })
          )
        );

        const filteredReplies = replyResults.filter(Boolean);

        if (isMounted.current) {
          setUserReplies((prev) => {
            const updated = { ...prev };
            filteredReplies.forEach(({ id, data }) => {
              updated[id] = data;
            });
            sessionStorage.setItem("userReplies", JSON.stringify(updated));
            return updated;
          });

          if (!sessionPosts[page]) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts or replies:", error);
        if (!sessionPosts[page]) {
          setIsLoading(false); 
        }
      }
    };

    fetchPostsAndReplies();
    const intervalId = setInterval(fetchPostsAndReplies, 5000);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [page, userBearerToken]);

  return { userPosts, userReplies, isLoading };
};
