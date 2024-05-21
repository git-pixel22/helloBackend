import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const owner = req.user;
    const {content} = req.body;

    if (!content || !content.trim()) {
        throw new ApiError(400, "Tweet has no content")
    }

    const tweet = await Tweet.create({
            owner,
            content
        }
    )

    if(!tweet) {
        throw new ApiError(500, "Some error occured while creating Tweet.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, tweet, "Tweet Created Successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;

    if(!userId.trim() || !isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const page = 1, limit = 10;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: {createdAt: -1}
    }

    try {
        const aggregationPipeline = [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $sort: options.sort
            }
        ];

        const result = await Tweet.aggregatePaginate(
            Tweet.aggregate(aggregationPipeline), 
            options
        );
        return res
        .status(200)
        .json(
            new ApiResponse(200, result, "Comments Fetched Successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Server Error");
    }

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}