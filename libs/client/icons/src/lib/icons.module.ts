import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { RemixIconModule } from 'angular-remix-icon';

import {
    RiBold,
    RiItalic,
    RiUnderline,
    RiStrikethrough,
    RiLink,
    RiLinkUnlink,
    RiAlignLeft,
    RiAlignRight,
    RiAlignCenter,
    RiAlignJustify,
    RiDoubleQuotesL,
    RiText,
    RiH1,
    RiH2,
    RiH3,
    RiSeparator,
    RiListUnordered,
    RiArrowGoForwardLine,
    RiArrowGoBackLine,
    RiImageAddLine,
    RiFilmLine,
    RiEmotionHappyLine,
    RiCloseLine,
    RiCheckLine,
    RiHardDrive2Line,
    RiChatSmile3Line,
    RiHome5Line,
    RiCompass3Line,
    RiGroupLine,
    RiDashboardLine,
    RiMore2Line,
    RiLoginCircleLine,
    RiLogoutCircleLine,
    RiHistoryLine,
    RiNotification3Line,
    RiSettings5Line,
    RiUserLine,
    RiUserAddLine,
    RiHeartLine,
    RiDislikeLine,
    RiChat3Line,
    RiEyeLine,
    RiArrowRightSLine,
    RiArrowLeftSLine,
    RiHeartFill,
    RiDislikeFill,
    RiBookMarkLine,
    RiFlagLine,
    RiQuillPenLine,
    RiBookOpenLine,
    RiThumbUpLine,
    RiBarChartLine,
    RiArrowDownSLine,
    RiPenNibLine,
    RiCalendar2Line,
    RiSearchLine,
    RiCupLine,
    RiInboxLine,
    RiSunLine,
    RiNewspaperLine,
    RiLoader2Line,
    RiLayoutGridFill,
    RiFilterLine,
    RiCheckboxBlankCircleLine,
    RiCheckboxCircleLine,
    RiSave3Line,
    RiEditLine,
    RiDeleteBin2Line,
    RiGlobalLine,
    RiTimeLine,
    RiCloseCircleLine,
    RiAlertLine,
    RiClipboardLine,
    RiBriefcase2Line,
    RiArrowUpSLine,
    RiCheckboxBlankLine,
    RiAddBoxLine,
    RiSendPlane2Line,
    RiLoader4Line,
    RiAddCircleLine,
    RiGroup2Line,
    RiMenuUnfoldLine,
    RiUserSettingsLine,
    RiShieldUserLine,
    RiNotificationBadgeLine,
    RiApps2Line,
    RiImageEditLine,
    RiUserFollowLine,
    RiUserSmileLine,
    RiMore2Fill,
    RiShareBoxLine,
    RiForbidLine,
    RiGift2Line,
    RiDeleteBinLine,
    RiBarChartBoxLine,
    RiDiscussLine,
    RiDraftLine,
    RiSwordLine,
    RiMagicLine,
    RiAliensLine,
    RiFilePaper2Line,
    RiEmotionLaughLine,
    RiGhost2Line,
    RiSearchEyeLine,
    RiHome3Line,
    RiHeartsLine,
    RiSkullLine,
    RiSpyLine,
    RiMeteorLine,
    RiDoorClosedLine,
    RiInformationLine,
    RiCollageLine,
    RiFontSize,
    RiBookmarkLine,
    RiEmpathizeLine,
    RiAuctionLine,
    RiScales3Line,
    RiChatPrivateLine,
    RiBugLine,
    RiServiceLine,
    RiBookReadLine,
    RiVipDiamondLine,
    RiCopperCoinLine,
    RiReplyLine,
    RiHeartAddLine,
    RiHeartAddFill,
    RiPagesLine,
    RiPagesFill,
    RiLoaderLine,
    RiCheckDoubleLine,
    RiDashboard2Line,
} from 'angular-remix-icon';

import {
    Rss,
    BookOpen,
    Archive,
    Book,
    Coffee,
    Inbox,
    Settings,
    Feather,
    Plus,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    CheckSquare,
    XSquare,
    Type,
    DownloadCloud,
    Upload,
    Flag,
    Clock,
    Bold,
    Italic,
    EyeOff,
    List,
    Minus,
    Code,
    ThumbsDown,
    ThumbsUp,
    FolderPlus,
    PlusCircle,
    CheckCircle,
    ChevronRight,
    XCircle,
    Eye,
    Search,
    CornerUpLeft,
    MessageSquare,
    RefreshCw,
    PlusSquare,
    UploadCloud,
    Check,
    X,
    ArrowDownCircle,
    ArrowUpCircle,
    ArrowLeftCircle,
    ArrowRightCircle,
    Square,
    Circle,
    HelpCircle,
    LogOut,
    Key,
    Menu,
    Filter,
    RotateCcw,
    Bookmark,
    Edit,
    BarChart2,
    MessageCircle,
    PenTool,
    Cloud,
    Layers,
    ChevronLeft,
    Grid,
    AlertTriangle,
    Users,
    AlignJustify,
    Clipboard,
    Hash,
    Briefcase,
    Calendar,
    Image,
    User,
    Home,
    Map,
    Bell,
    Mail,
    Heart,
    Compass,
    UserPlus,
    HardDrive,
    Loader,
    Folder,
    FolderMinus,
    FileText,
    Globe,
    Save,
    MoreVertical,
    ChevronDown,
    ArrowRight,
    LogIn,
    UserCheck,
    Maximize,
    Share,
    Info,
    MoreHorizontal,
    Shield,
    Link,
    ExternalLink,
    Gift,
    Underline,
    Film,
    Smile,
    CornerUpRight,
    AlignLeft,
    AlignRight,
    AlignCenter,
} from 'angular-feather/icons';

const icons = {
    Rss,
    BookOpen,
    Archive,
    Book,
    Coffee,
    Inbox,
    Settings,
    Feather,
    Plus,
    Edit3,
    Trash2,
    Lock,
    Unlock,
    CheckSquare,
    XSquare,
    Type,
    DownloadCloud,
    Upload,
    Flag,
    Clock,
    Bold,
    Italic,
    EyeOff,
    List,
    Minus,
    Code,
    ThumbsDown,
    ThumbsUp,
    FolderPlus,
    PlusCircle,
    CheckCircle,
    ChevronRight,
    XCircle,
    Eye,
    Search,
    CornerUpLeft,
    MessageSquare,
    RefreshCw,
    PlusSquare,
    UploadCloud,
    Check,
    X,
    ArrowDownCircle,
    ArrowUpCircle,
    ArrowLeftCircle,
    ArrowRightCircle,
    Square,
    Circle,
    HelpCircle,
    LogOut,
    Key,
    Menu,
    Filter,
    RotateCcw,
    Bookmark,
    Edit,
    BarChart2,
    MessageCircle,
    PenTool,
    Cloud,
    Layers,
    ChevronLeft,
    Grid,
    AlertTriangle,
    Users,
    AlignJustify,
    Clipboard,
    Hash,
    Briefcase,
    Calendar,
    Image,
    User,
    Home,
    Map,
    Bell,
    Mail,
    Heart,
    Compass,
    UserPlus,
    HardDrive,
    Loader,
    Folder,
    FolderMinus,
    FileText,
    Globe,
    Save,
    MoreVertical,
    ChevronDown,
    ArrowRight,
    LogIn,
    UserCheck,
    Maximize,
    Share,
    Info,
    MoreHorizontal,
    Shield,
    Link,
    ExternalLink,
    Gift,
    Underline,
    Film,
    Smile,
    CornerUpRight,
    AlignLeft,
    AlignRight,
    AlignCenter,
};

const remixIcons = {
    RiBold,
    RiItalic,
    RiUnderline,
    RiStrikethrough,
    RiLink,
    RiLinkUnlink,
    RiAlignLeft,
    RiAlignCenter,
    RiAlignRight,
    RiAlignJustify,
    RiDoubleQuotesL,
    RiText,
    RiH1,
    RiH2,
    RiH3,
    RiListUnordered,
    RiSeparator,
    RiArrowGoForwardLine,
    RiArrowGoBackLine,
    RiImageAddLine,
    RiFilmLine,
    RiEmotionHappyLine,
    RiCloseLine,
    RiCheckLine,
    RiHardDrive2Line,
    RiChatSmile3Line,
    RiHome5Line,
    RiCompass3Line,
    RiGroupLine,
    RiDashboardLine,
    RiMore2Line,
    RiLoginCircleLine,
    RiLogoutCircleLine,
    RiHistoryLine,
    RiNotification3Line,
    RiSettings5Line,
    RiUserLine,
    RiUserAddLine,
    RiHeartLine,
    RiDislikeLine,
    RiChat3Line,
    RiEyeLine,
    RiArrowRightSLine,
    RiArrowLeftSLine,
    RiHeartFill,
    RiDislikeFill,
    RiBookMarkLine,
    RiFlagLine,
    RiQuillPenLine,
    RiBookOpenLine,
    RiThumbUpLine,
    RiBarChartLine,
    RiArrowDownSLine,
    RiPenNibLine,
    RiCalendar2Line,
    RiSearchLine,
    RiCupLine,
    RiInboxLine,
    RiSunLine,
    RiNewspaperLine,
    RiLoader2Line,
    RiLayoutGridFill,
    RiFilterLine,
    RiCheckboxBlankCircleLine,
    RiCheckboxCircleLine,
    RiSave3Line,
    RiEditLine,
    RiDeleteBin2Line,
    RiGlobalLine,
    RiTimeLine,
    RiCloseCircleLine,
    RiAlertLine,
    RiClipboardLine,
    RiBriefcase2Line,
    RiArrowUpSLine,
    RiCheckboxBlankLine,
    RiAddBoxLine,
    RiSendPlane2Line,
    RiLoader4Line,
    RiAddCircleLine,
    RiGroup2Line,
    RiMenuUnfoldLine,
    RiUserSettingsLine,
    RiShieldUserLine,
    RiNotificationBadgeLine,
    RiApps2Line,
    RiImageEditLine,
    RiUserFollowLine,
    RiUserSmileLine,
    RiMore2Fill,
    RiShareBoxLine,
    RiForbidLine,
    RiGift2Line,
    RiDeleteBinLine,
    RiBarChartBoxLine,
    RiDiscussLine,
    RiDraftLine,
    RiSwordLine,
    RiMagicLine,
    RiAliensLine,
    RiFilePaper2Line,
    RiEmotionLaughLine,
    RiGhost2Line,
    RiSearchEyeLine,
    RiHome3Line,
    RiHeartsLine,
    RiSkullLine,
    RiSpyLine,
    RiMeteorLine,
    RiDoorClosedLine,
    RiInformationLine,
    RiCollageLine,
    RiFontSize,
    RiBookmarkLine,
    RiEmpathizeLine,
    RiAuctionLine,
    RiScales3Line,
    RiChatPrivateLine,
    RiBugLine,
    RiServiceLine,
    RiBookReadLine,
    RiVipDiamondLine,
    RiCopperCoinLine,
    RiReplyLine,
    RiHeartAddLine,
    RiHeartAddFill,
    RiPagesLine,
    RiPagesFill,
    RiLoaderLine,
    RiCheckDoubleLine,
    RiDashboard2Line,
};

@NgModule({
    declarations: [],
    imports: [CommonModule, FeatherModule.pick(icons), RemixIconModule.configure(remixIcons)],
    exports: [FeatherModule, RemixIconModule],
})
export class IconsModule {}
