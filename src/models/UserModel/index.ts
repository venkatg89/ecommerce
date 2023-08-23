export type Uid = string

export interface ProfileModel {
  name: Uid;
  uid: string;
  bio?: string;
  followingCount: number;
  followerCount: number;
  agreedAnswerCount: number;
  createdQuestionCount: number;
  image: string;
}
