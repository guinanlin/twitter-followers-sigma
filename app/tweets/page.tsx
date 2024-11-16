'use client'

import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Tweet {
  id: string;
  createdAt: string;
  username: string;
  time: string;
  tweetId: string;
  text: string;
  judgmentCode: number;
  result: string;
}

const ITEMS_PER_PAGE = 20;

export default function TweetsPage() {
  const [page, setPage] = React.useState(1);
  const [tweets, setTweets] = React.useState<Tweet[]>([]);
  const [totalPages, setTotalPages] = React.useState(0);

  const fetchTweets = async (page: number) => {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tweets?skip=${skip}&limit=${ITEMS_PER_PAGE}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch tweets:", response.statusText);
      return;
    }

    const data = await response.json();
    console.log(data);
    const formattedTweets = data.data.map((tweet: any) => ({
      id: tweet.id,
      createdAt: formatDate(new Date(tweet.created_at)),
      username: tweet.username,
      time: formatDate(new Date(tweet.time)),
      tweetId: tweet.tweetid,
      text: tweet.text,
      judgmentCode: tweet.judgmentCode,
      result: tweet.result,
    }));

    setTweets(formattedTweets);
    setTotalPages(data.meta.total_pages);
  };

  useEffect(() => {
    fetchTweets(page);
  }, [page]);

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px] whitespace-nowrap sticky top-0 bg-white z-10">Created At</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Username</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Time</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Tweet ID</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Text</TableHead>
              <TableHead className="text-center sticky top-0 bg-white z-10">Judgment Code</TableHead>
              <TableHead className="sticky top-0 bg-white z-10">Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tweets.map((tweet) => (
              <TableRow 
                key={tweet.id} 
                className={tweet.judgmentCode === 1 ? "bg-yellow-100 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-900" : tweet.judgmentCode === 2 ? "bg-orange-100 hover:bg-orange-100 dark:bg-orange-900 dark:hover:bg-orange-900" : ""}
              >
                <TableCell className="py-2 px-4 font-medium">{tweet.createdAt}</TableCell>
                <TableCell>{tweet.username}</TableCell>
                <TableCell>{tweet.time}</TableCell>
                <TableCell>{tweet.tweetId}</TableCell>
                <TableCell className="max-w-[200px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help truncate inline-block w-full">
                          {tweet.text}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] whitespace-normal break-words">
                        <p>{tweet.text}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-center">{tweet.judgmentCode}</TableCell>
                <TableCell className="max-w-[300px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help truncate inline-block w-full">
                          {tweet.result}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[300px] whitespace-normal break-words">
                        <p>{tweet.result}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= page - 1 && pageNumber <= page + 1)) {
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(pageNumber);
                      }}
                      isActive={page === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (pageNumber === 2 && page > 3) {
                return (
                  <PaginationItem key="ellipsis-start">
                    <span className="mx-2">...</span>
                  </PaginationItem>
                );
              }
              if (pageNumber === totalPages - 1 && page < totalPages - 2) {
                return (
                  <PaginationItem key="ellipsis-end">
                    <span className="mx-2">...</span>
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

// 格式化日期的函数
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};