declare namespace Api {
  namespace Game {
    /** 玩家登录信息 */
    interface LoginUser {
      id: number;
      /** 昵称 */
      nickName: string;
      /** 头像地址 */
      avatar: string;
    }

    /** CSGO 武器信息 */
    interface CsgoWeapon {
      /** 武器类型 */
      type?: string | null;
      /** 显示名称 */
      displayName?: string | null;
      /** 内部名称 */
      name?: string | null;
      /** 状态 */
      state?: string | null;
      /** 当前弹夹弹药 */
      ammoClip?: number | null;
      /** 弹夹容量 */
      ammoClipMax?: number | null;
      /** 后备弹药 */
      ammoReserve?: number | null;
    }

    /** 玩家游戏内实时数据 */
    interface UserGameData {
      /** 玩家登录信息 */
      loginUser: Api.Game.LoginUser;
      /** 阵营（ct/t/spectator） */
      team?: string;
      /** 生命值 */
      health?: number;
      /** 护甲值 */
      armor?: number;
      /** 金钱数 */
      money?: number;
      /** 装备价值 */
      equipValue?: number;
      /** 当前武器 */
      weapon?: Api.Game.CsgoWeapon;
      /** 弹夹内弹药数 */
      clipAmmo?: number;
      /** 备用弹药数 */
      reserveAmmo?: number;
      /** 是否有头盔 */
      helmet?: boolean;
      /** 击杀数 */
      kills?: number;
      /** 分数（CSGO 内的玩家积分） */
      score?: number;
    }

    /** 玩家操作动态记录 */
    interface PlayerActionLog {
      /** 执行操作的玩家 */
      loginUser: Api.Game.LoginUser;
      /** 操作时间（yyyy-MM-dd HH:mm:ss） */
      actionTime: string;
      /** 操作动态内容（如：开始挤服、暂停挤服、加入服务器） */
      actionContent: string;
    }

    /** 服务器游戏实时信息（对应 ServerInfoData） */
    interface ServerInfoData {
      /** 服务器ID */
      id: number;
      /** CT 阵营分数 */
      CTScore: string;
      /** 当前回合状态 */
      mapPhase: string;
      /** 当前回合阶段 */
      mapStage: string;
      /** 回合数 */
      round: string;
      /** T 阵营分数 */
      TScore: string;
    }

    /** 服务器 VO（对应 ServerVo，来自 /ws/public/server 推送 code=202） */
    interface SeverVo {
      /** 服务器ID */
      serverId: number;
      /** 社区名称 */
      communityName: string;
      /** 社区ID */
      communityId: number;
      /** 地图ID */
      mapId: number;
      /** 地图名称 */
      mapName: string;
      /** 译名 */
      mapLabel: string;
      /** 图片路径 */
      mapUrl: string;
      /** 地图难度 */
      type: string;
      /** 地图标签 */
      tag: string[];
      /** 地图神器 */
      artifact: string;
      /** 服务器名称 */
      serverName: string;
      /** 服务器模式 */
      mode: number;
      /** 排序值（0 最前，升序展示） */
      sort: number | null;
      /** 游玩人数 */
      numPlayers: number;
      /** 最大在线人数 */
      maxPlayers: number;
      /** 连接地址 */
      connectStr: string;
      /** 最小连接人数 */
      minPlayers: number;
      /** 换图记录时间 */
      dateTimeOriginal: string;
      /** 服务器Ping值 */
      ping: number;
      /** 服务器在线状态 */
      isOnline: boolean;
      /** 服务器回合 */
      round: string | null;
      /** CT胜利回合 */
      CTScore: string | null;
      /** T胜利回合 */
      TScore: string | null;
      /** 游戏对局阶段 */
      mapStage: string | null;
      /** 游戏回合阶段 */
      mapPhase: string | null;
    }

    /**
     * 服务器游戏实时数据（对应 ServerGameDataVo，推送 code=204）
     * key：服务器ID字符串
     */
    interface ServerGameDataVo {
      /** 服务器信息映射表 */
      serverInfoMap: Record<string, Api.Game.ServerInfoData>;
      /** 玩家信息映射表（key：服务器ID字符串，value：该服务器下的玩家列表） */
      userGameDataMap: Record<string, Api.Game.UserGameData[]>;
      /** 玩家操作动态列表映射表（key：服务器ID字符串，value：该服务器下的动态记录列表） */
      playerActionMap: Record<string, Api.Game.PlayerActionLog[]>;
    }

    /** 游戏社区 VO（对应 GameCommunityVo，来自 /gameCommunity/list） */
    interface GameCommunityVo {
      /** 社区 ID */
      id: number;
      /** 社区名称 */
      communityName: string;
      /** 社区 logo */
      logo: string;
      /** 社区网站 */
      website: string;
      /** 服务器数量（接口可能不返回，可用实时数据统计） */
      serverNumber?: number;
      /** 玩家数量（接口可能不返回，可用实时数据统计） */
      playerNumber?: number;
      /** 创建时间 */
      createTime?: string;
    }

    /** WebSocket 通用消息包装（对应 MessageVo） */
    interface WsMessage<T = unknown> {
      /** 消息码，如 "202" "204" */
      code: string;
      /** 业务数据 */
      data: T;
      /** 提示语 */
      msg: string | null;
    }

    /** 地图游玩次数排行 VO（/gameServerMapRecord/getMapPlayCountTop） */
    interface GameMapPlayCountVo {
      /** 地图ID */
      mapId: number;
      /** 地图名称 */
      mapName: string;
      /** 译名 */
      mapLabel: string;
      /** 图片路径 */
      mapUrl: string;
      /** 运行次数 */
      playCount: number;
    }

    /** 社区在线人数数据系列 */
    interface CommunityOnlineSeriesVo {
      /** 社区ID */
      communityId: number;
      /** 社区名称 */
      communityName: string;
      /** 各时间点的在线人数 */
      data: number[];
    }

    /** 社区在线人数柱状图 VO（/gameServerMapRecord/getCommunityOnlineBar） */
    interface CommunityOnlineBarVo {
      /** X 轴时间轴（每半小时一个点位） */
      timeAxis: string[];
      /** 各社区的数据系列 */
      series: CommunityOnlineSeriesVo[];
    }
  }
}
