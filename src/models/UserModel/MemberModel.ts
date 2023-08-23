import { ProfileModel } from 'src/models/UserModel'
import { NodeProfileModel } from 'src/models/UserModel/NodeProfileModel'

export interface MemberCommunityModel {
  favoriteCategories: number[];
}

export interface MemberModel {
  profile: ProfileModel;
  community?: MemberCommunityModel;
  nodeProfile?: NodeProfileModel;
}
