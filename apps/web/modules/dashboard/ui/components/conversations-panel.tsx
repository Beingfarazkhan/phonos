"use client"

import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@workspace/ui/components/select'
import { ScrollArea, ScrollBar } from '@workspace/ui/components/scroll-area'
import { DiceBearAvatar } from '@workspace/ui/components/dicebear-avatar'
import { ConversationStatusIcon } from '@workspace/ui/components/conversation-status-icon'
import { formatDistanceToNow } from 'date-fns'

import { getCountryFromTimezone } from '@/lib/country-utils'
import { useInfiniteScroll } from '@workspace/ui/hooks/use-infinite-scroll'
import { InfiniteScrollTrigger } from '@workspace/ui/components/infinite-scroll-trigger'

import { ArrowRightIcon, ArrowUpIcon, CheckIcon, CornerUpLeftIcon, ListIcon, ReplyIcon } from 'lucide-react'
import { usePaginatedQuery } from 'convex/react'
import { api } from '@workspace/backend/_generated/api'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'
import { usePathname } from 'next/navigation'
import { useAtom } from 'jotai/react'
import { statusFilterAtom } from '../../atoms'
import { Skeleton } from '@workspace/ui/components/skeleton'

export const ConversationsPanel = () => {

    const [statusFilter, setStatusFilter] = useAtom(statusFilterAtom)

    const pathName = usePathname()

    const conversations = usePaginatedQuery(
        api.private.conversations.getMany,
        { status: statusFilter === "all" ? undefined : statusFilter },
        { initialNumItems: 10 },
    )


    const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore, isLoadingFirstPage } = useInfiniteScroll({
        status: conversations.status,
        loadMore: conversations.loadMore,
        loadSize: 10
    })

    return (
        <div className="h-full w-full flex flex-col bg-background">
            <div className=" flex flex-col gap-3.5 border-b-2 p-2">
                <Select
                    defaultValue='all'
                    onValueChange={(val) => { setStatusFilter(val as "unresolved" | "resolved" | "escalated" | "all") }}
                    value={statusFilter}
                >
                    <SelectTrigger
                        className='h-6 border-none px-1.5 shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0'
                    >
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent className='ml-10'>
                        <SelectItem value='all'>
                            <div className='flex items-center gap-2'>
                                <ListIcon className='size-4' />
                                <span>All</span>
                            </div>
                        </SelectItem>
                        <SelectItem value='unresolved'>
                            <div className='flex items-center gap-2'>
                                <ArrowRightIcon className='size-4 rounded-full bg-red-600 text-white' />
                                <span>Unresolved</span>
                            </div>
                        </SelectItem>
                        <SelectItem value='escalated'>
                            <div className='flex items-center gap-2'>
                                <ArrowUpIcon className='size-4 rounded-full bg-yellow-500 text-white' />
                                <span>Escalated</span>
                            </div>
                        </SelectItem>
                        <SelectItem value='resolved'>
                            <div className='flex items-center gap-2'>
                                <CheckIcon className='size-4 rounded-full bg-green-500 text-white' />
                                <span>Resolved</span>
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {isLoadingFirstPage ? (
                <SkeletonConversations />
            ) :
                (
                    <ScrollArea className='max-h-[calc(100vh-53px)]'>
                        <div className='flex flex-col flex-1 w-full text-sm'>
                            {conversations.results.map((conversation) => {
                                const isLastMessageByOperator = conversation.lastMessage?.message?.role !== "user"

                                const country = getCountryFromTimezone(conversation.contactSession.metadata?.timezone)

                                const countryFlagUrl = `https://flagcdn.com/w40/${country?.code?.toLowerCase()}.png`

                                return (
                                    <Link
                                        href={`/conversations/${conversation._id}`}
                                        key={conversation._id}
                                        className={cn(
                                            'relative flex cursor-pointer items-start gap-3 border-b p-3 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground',
                                            pathName === `/conversations/${conversation._id}` &&
                                            "bg-accent text-accent-foreground"
                                        )}

                                    >
                                        <div className={cn(
                                            'absolute -translate-y-1/2 top-1/2 left-0 h-[64%] w-1 rounded-r-full bg-neutral-300 opacity-0 transition-opacity',
                                            pathName === `/conversations/${conversation._id}` &&
                                            "opacity-100"
                                        )
                                        } />
                                        <DiceBearAvatar
                                            seed={conversation.contactSession._id}
                                            size={40}
                                            className='shrink-0'
                                            badgeImageUrl={countryFlagUrl}
                                        />
                                        <div className='flex-1'>
                                            <div className='flex w-full items-center gap-2'>
                                                <span className="truncate font-bold">{conversation.contactSession.name}</span>
                                                <span className="shrink-0 ml-auto text-muted-foreground text-xs">{formatDistanceToNow(conversation._creationTime)}</span>
                                            </div>
                                            <div className='mt-1 flex items-center justify-center gap-2'>
                                                <div className='flex w-0 grow items-center gap-1'>
                                                    {isLastMessageByOperator && (
                                                        <CornerUpLeftIcon className='size-3 shrink-0 text-muted-foreground' />
                                                    )}
                                                    <span className={cn(
                                                        'line-clamp-1 text-muted-foreground text-xs',
                                                        !isLastMessageByOperator && 'font-black text-black'
                                                    )}>{conversation.lastMessage?.text}</span>
                                                </div>
                                                <ConversationStatusIcon status={conversation.status} />
                                            </div>

                                        </div>
                                    </Link>
                                )
                            })}

                            <InfiniteScrollTrigger
                                canLoadMore={canLoadMore}
                                isLoadingMore={isLoadingMore}
                                onLoadMore={handleLoadMore}
                                ref={topElementRef}
                                noMoreText='No more chats'

                            />
                        </div>

                        <ScrollBar />
                    </ScrollArea>
                )}
        </div>
    )
}

export const SkeletonConversations = () => {
    return (
        <div className='flex flex-col flex-1 min-h-0 gap-2 overflow-auto'>
            <div className='relative flex flex-col w-full min-w-0 p-2'>
                <div className='w-full space-y-2'>
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className='flex items-start gap-3 rounded-lg p-4'>
                            <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
                            <div className='min-w-0 flex-1'>
                                <div className='flex w-full items-center gap-2'>
                                    <Skeleton className='h-4 w-24' />
                                    <Skeleton className='ml-auto h-3 w-12 shrink-0' />
                                </div>
                                <div className='mt-2'>
                                    <Skeleton className='h-3 w-full' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}