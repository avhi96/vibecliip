import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import {MoreHorizontal} from 'lucide-react'

const post = () => {
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='felx items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src="" alt='post_image' />
                        <AvatarFallback>OM</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />

                    </DialogTrigger>
                    
                </Dialog>
            </div>
        </div>
    )
}

export default post
