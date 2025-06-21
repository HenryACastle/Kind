"use client";

import { UsersRound, UserRound, CirclePlus, StickyNote, Ellipsis, PlaneLanding } from "lucide-react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { UserButton } from "@clerk/nextjs";

export default function MobileNavigationBar() {
    return (
        <div className="fixed bottom-0 z-50 w-full h-16 bg-white border border-gray-200    dark:bg-gray-700 dark:border-gray-600">
            <div className="grid h-full max-w-lg grid-cols-5 mx-auto">

                <Link className="w-full h-full flex items-center justify-center hover:bg-amber-200" href="/app">
                    <UserRound className="w-6 h-6" />

                </Link>

                <Link className="w-full h-full flex items-center justify-center hover:bg-amber-200" href="#">
                    <UsersRound className="w-6 h-6 text-gray-100" />

                </Link>


                <Link className="w-full h-full flex items-center justify-center hover:bg-amber-200" href="/app/new">
                    <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                        <CirclePlus className="w-6 h-6  " />
                    </div>
                </Link>

                <Link className="w-full h-full flex items-center justify-center hover:bg-amber-200" href="#">
                    <StickyNote className="w-6 h-6 text-gray-100" />

                </Link>

                <Popover>
                    <PopoverTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center hover:bg-amber-200">
                            <Ellipsis className="w-6 h-6" />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 mb-2" side="top" align="center">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-md ">
                                <UserButton />
                            </div>
                            <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <PlaneLanding className="w-4 h-4" />
                                Landing Page
                            </Link>

                        </div>
                    </PopoverContent>
                </Popover>

            </div>
        </div>
    );
}
