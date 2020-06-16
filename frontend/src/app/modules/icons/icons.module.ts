import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';

import { Rss, BookOpen, Archive, Book, Coffee, Inbox, Settings, Feather,
         Plus, Edit3, Trash2, Lock, Unlock, CheckSquare, XSquare, Type,
         DownloadCloud, Upload, Flag, Clock, Bold, Italic, EyeOff, List,
         Minus, Code, ThumbsDown, ThumbsUp, FolderPlus, PlusCircle, CheckCircle,
         ChevronRight, XCircle, Eye, Search, CornerUpLeft, MessageSquare,
         RefreshCw, PlusSquare, UploadCloud, Check, X, ArrowDownCircle,
         ArrowUpCircle, ArrowLeftCircle, ArrowRightCircle, Square, Circle,
         HelpCircle, LogOut, Key, Menu, Filter } from 'angular-feather/icons';

const icons = {
  Rss, BookOpen, Archive, Book, Coffee, Inbox, Settings,
  Feather, Plus, Edit3, Trash2, Lock, Unlock, CheckSquare,
  XSquare, Type, DownloadCloud, Upload, Flag, Clock, Bold,
  Italic, EyeOff, List, Minus, Code, ThumbsDown, ThumbsUp,
  FolderPlus, PlusCircle, CheckCircle, ChevronRight, XCircle,
  Eye, Search, CornerUpLeft, MessageSquare, RefreshCw, PlusSquare,
  UploadCloud, Check, X, ArrowDownCircle, ArrowUpCircle, ArrowLeftCircle,
  ArrowRightCircle, Square, Circle, HelpCircle, LogOut, Key, Menu, Filter
};

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
