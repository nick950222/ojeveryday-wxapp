import {
  AtActionSheet,
  AtActionSheetItem,
  AtInput,
  AtLoadMore,
  AtToast
} from "taro-ui";
import { View, Text, Button, Image } from "@tarojs/components";
import { NetworkManager, RankItemModel } from "../../network/network";
import { dailyRankStore } from "../../store/dailyrank";

interface IBindingIdActionSheetProps {
  isOpened: boolean;
}

interface IBindingIdActionSheetState {
  isOpened: boolean;
  searchId: string;
  resultId: string;
  isSearchingUser: boolean;
  isSearchedUser: boolean;
  respUser: RankItemModel | null;
}

class BindingIdActionSheet extends Taro.Component<
  IBindingIdActionSheetProps,
  IBindingIdActionSheetState
> {
  constructor(props: IBindingIdActionSheetProps) {
    super(props);
    this.state = {
      isOpened: props.isOpened,
      searchId: "",
      resultId: "",
      isSearchingUser: false,
      isSearchedUser: false,
      respUser: null
    };
  }

  render() {
    const {
      isOpened,
      searchId,
      resultId,
      isSearchingUser,
      isSearchedUser,
      respUser
    } = this.state;
    return (
      <AtActionSheet {...this.props} cancelText="取消" title="">
        <View
          style={{
            width: "100%",
            display: "flex",
            textAlign: "left",
            flexDirection: "column"
          }}
        >
          <View
            style={{
              paddingRight: "20px"
            }}
          >
            <AtInput
              name="value"
              type="text"
              placeholder="请输入力扣ID"
              onChange={value => {
                this.setState({ searchId: value as string });
              }}
            >
              <Text
                onClick={() => {
                  this.setState({ isSearchingUser: true });
                  NetworkManager.getUserRank(this.state.searchId)
                    .then((resp: RankItemModel[]) => {
                      if (resp.length === 0) {
                        console.log("没有搜到");
                      } else {
                        this.setState({
                          isSearchedUser: true,
                          respUser: resp[0]
                        });
                      }
                    })
                    .catch(() => {
                      console.log("网络错误");
                    })
                    .finally(() => {
                      this.setState({ isSearchingUser: false });
                    });
                }}
              >
                搜索
              </Text>
            </AtInput>
          </View>
          <Text
            style={{
              fontSize: "12px",
              fontFamily: "PingFangSC-Regular,PingFang SC",
              color: "rgba(11,11,51,0.6)",
              paddingTop: "8px",
              paddingLeft: "20px",
              paddingRight: "20px"
            }}
          >
            若未加入打卡组，请点击下方复制按钮，前往浏览器粘贴打开加入
          </Text>
        </View>

        <AtActionSheetItem
          onClick={() => {
            // 绑定成功
            if (isSearchedUser && respUser && respUser.username) {
              dailyRankStore.saveLeetCodeUserId(respUser.username);
            }
            // 复制
            else if (!isSearchedUser) {
            }
          }}
        >
          {isSearchingUser ? (
            <AtLoadMore status="loading" loadingText="搜索中" />
          ) : isSearchedUser ? (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Image
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "14px",
                  border: "0px solid rgba(151,151,151,1)",
                  marginRight: "10px"
                }}
                src={respUser && respUser.avatar !== "" ? respUser.avatar : ""}
              />
              绑定
              {respUser && "("}
              <Text
                style={{
                  maxWidth: "180px",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}
              >
                {respUser ? `${(respUser as RankItemModel).username}` : ""}
              </Text>
              {respUser && ")"}
            </View>
          ) : (
            <View>复制</View>
          )}
        </AtActionSheetItem>
      </AtActionSheet>
    );
  }
}

export default BindingIdActionSheet;