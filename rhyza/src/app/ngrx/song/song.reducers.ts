import { SongState } from './song.state';
import { SongModel } from '../../models/song.model';
import { createReducer, on } from '@ngrx/store';
import * as SongActions from './song.actions';

export const initialSongState: SongState = {
  songDetail: <SongModel>{},
  songList: <SongModel[]>[],
  songHistory: <SongModel[]>[],
  songQueue: <SongModel[]>[],
  songCategory: <SongModel[]>[],
  isLoading: false,
  error: null,
};

export const songReducer = createReducer(
  initialSongState,
  on(SongActions.getSongById, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.getSongByIdSuccess, (state, { songDetail, type }) => {
    console.log(type);
    return <SongState>{
      ...state,
      songDetail: songDetail,
      isLoading: false,
    };
  }),

  on(SongActions.getSongByIdFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),

  on(SongActions.getSongList, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.getSongListSuccess, (state, { songList, type }) => {
    console.log(type);
    return <SongState>{
      ...state,
      songList: songList,
      isLoading: false,
    };
  }),

  on(SongActions.getSongListFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),



  on(SongActions.createSong, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.createSongSuccess, (state, { song, type }) => {
    console.log(type);
    return <SongState>{
      ...state,
      songDetail: song,
      isLoading: false,
    };
  }),

  on(SongActions.createSongFailure, (state, { error, type }) => {
    console.log(type);
    console.log(error);
    console.log(error.message);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),

  //update views
  on(SongActions.updateSongViews, (state, { type }) => {
    console.log(type);
    return {
      ...state,
    };
  }),

  on(SongActions.updateSongViewsSuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
    };
  }),

  on(SongActions.updateSongViewsFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
    };
  }),


  //get song history

  on(SongActions.getSongHistory, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.getSongHistorySuccess, (state, { songHistory, type }) => {
    console.log(type);
    return <SongState>{
      ...state,
      songHistory: songHistory,
      isLoading: false,
    };
  }),


  on(SongActions.getSongHistoryFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),



  //create song history

  on(SongActions.createSongHistory, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.createSongHistorySuccess, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: false,
    };
  }),

  on(SongActions.createSongHistoryFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),


  //get song queue
  on(SongActions.getSongQueue, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.getSongQueueSuccess, (state, { songQueue, type }) => {
    console.log(type);
    return {
      ...state,
      songQueue: songQueue,
      isLoading: false,
    };
  }),

  on(SongActions.getSongQueueFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),

  //get song category
  on(SongActions.getSongCategory, (state, { type }) => {
    console.log(type);
    return {
      ...state,
      isLoading: true,
    };
  }),

  on(SongActions.getSongCategorySuccess, (state, { songCategory, type }) => {
    console.log(type);
    return {
      ...state,
      songCategory: songCategory,
      isLoading: false,
    };
  }),

  on(SongActions.getSongCategoryFailure, (state, { error, type }) => {
    console.log(type);
    return {
      ...state,
      error: error,
      isLoading: false,
    };
  }),
);
