import { useState, useEffect, useRef } from "react";
import axios from "axios";

export const useLiveUserPosts = (page, userBearerToken) => {
  const cachedPosts = JSON.parse(sessionStorage.getItem("userPosts") || "{}");
  const cachedReplies = JSON.parse(sessionStorage.getItem("userReplies") || "{}");

  const [userPosts, setUserPosts] = useState(cachedPosts);
  const [userReplies, setUserReplies] = useState(cachedReplies);

  const [loadingPages, setLoadingPages] = useState(() => {
    return (!cachedPosts[page] || cachedPosts[page].length === 0) ? [page] : [];
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    if (!userPosts[page] || userPosts[page].length === 0) {
      setLoadingPages(prev => [...new Set([...prev, page])]);
    }

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

        if (!isMounted.current) return;

        setUserPosts(prev => {
          const updated = { ...prev, [page]: posts };
          sessionStorage.setItem("userPosts", JSON.stringify(updated));
          return updated;
        });

        const replyResults = await Promise.all(
          posts.map(post =>
            axios
              .get(`https://supabase-socmed.vercel.app/post/${post.id}`, {
                headers: { Authorization: `Bearer ${userBearerToken}` },
              })
              .then(res => ({ id: post.id, data: res.data }))
              .catch(err => {
                console.error(`Failed to fetch replies for post ${post.id}`, err);
                return null;
              })
          )
        );

        const filteredReplies = replyResults.filter(Boolean);
        setUserReplies(prev => {
          const updated = { ...prev };
          filteredReplies.forEach(({ id, data }) => {
            updated[id] = data;
          });
          sessionStorage.setItem("userReplies", JSON.stringify(updated));
          return updated;
        });

        setLoadingPages(prev => prev.filter(p => p !== page));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchPostsAndReplies();

    const intervalId = setInterval(fetchPostsAndReplies, 15000);

    return () => {
      isMounted.current = false;
      clearInterval(intervalId);
    };
  }, [page, userBearerToken]);

  const isLoading = loadingPages.includes(page);

  return { userPosts, userReplies, isLoading, setUserReplies };
};
