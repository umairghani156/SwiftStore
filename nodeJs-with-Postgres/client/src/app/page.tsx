import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Feed from "@/components/feed/FeedList";
import Sidebar from "@/components/layout/Sidebar";
import PostList from "@/components/post/PostList";

export default function Home() {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <PostList />
        </div>
      </div>
  
  );
}
