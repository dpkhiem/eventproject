@echo off
@REM SetLocal
setlocal enabledelayedexpansion
set destinalSrc=D:\Work\CloneProject\BTQH
set rootSrc=D:\Work\SimpleProject
set templateSrc=D:\Work\CloneProject\Template
set projectName=SlotBatTienQuaHai
echo Design by Tony

@REM set /p rootSrc=Enter Root: 
echo Root: %rootSrc%

IF EXIST "%rootSrc%" (
  @REM set /p destinalSrc=Enter project name: 
  @REM echo Project Name: %destinalSrc%
    @REM call myFunction a b

    @REM for %%F in ("%rootSrc%\*.*") do (
    @REM       echo File: %%~nxF
    @REM )

    @REM for /d %%F in ("%folderPath%\*") do (
    @REM       echo Folder: %%~nxF
    @REM   )
    
    IF EXIST "%destinalSrc%" (
      echo "%destinalSrc%";
      rmdir /s "%destinalSrc%";
    )
    @REM ==========================MKDIR==============================
    mkdir "%destinalSrc%";
    xcopy "%templateSrc%" "%destinalSrc%" /e /h
    @REM mkdir "%destinalSrc%\assets";
    mkdir "%destinalSrc%\assets\BTGames";
    mkdir "%destinalSrc%\assets\BTGames\Lobby";

    @REM ==========================MKLINK==============================
	mklink "%destinalSrc%\assets\BTGames.meta" "%rootSrc%\assets\BTGames.meta"
    mklink /D "%destinalSrc%\assets\ViDu" "%rootSrc%\assets\ViDu";
    mklink "%destinalSrc%\assets\ViDu.meta" "%rootSrc%\assets\ViDu.meta";
    mklink /D "%destinalSrc%\assets\Lobby" "%rootSrc%\assets\Lobby";
    mklink "%destinalSrc%\assets\Lobby.meta" "%rootSrc%\assets\Lobby.meta";
    mklink /D "%destinalSrc%\assets\migration" "%rootSrc%\assets\migration";
    mklink "%destinalSrc%\assets\migration.meta" "%rootSrc%\assets\migration.meta";

    @REM ==========================MKLINK GAME==========================
    for %%F in ("%rootSrc%\assets\BTGames\Lobby\*.*") do (
      echo MK link File: %%~nxF to %destinalSrc%\assets\BTGames\Lobby
      @REM set string1="Hello World1"
      @REM set string2="Hello World"
      @REM if !string1! == !string2! ( echo "Both the strings are equal" )
      @REM IF test == "PTBridges.ts" ( echo %%~nxF Exist )
      mklink "%destinalSrc%\assets\BTGames\Lobby\%%~nxF" "%rootSrc%\assets\BTGames\Lobby\%%~nxF"
    )

    for /d %%F in ("%rootSrc%\assets\BTGames\Lobby\*") do (
      echo MK link Folder: %%~nxF to %destinalSrc%\assets\BTGames\Lobby
      mklink /D "%destinalSrc%\assets\BTGames\Lobby\%%~nxF" "%rootSrc%\assets\BTGames\Lobby\%%~nxF";
    )

    @REM ==========================REMOVE MKLINK GAME SCRIPT======================
    rmdir "%destinalSrc%\assets\BTGames\Lobby\Games" /s /q;
    mkdir "%destinalSrc%\assets\BTGames\Lobby\Games";
    mklink /D "%destinalSrc%\assets\BTGames\Lobby\Games\SlotNew" "%rootSrc%\assets\BTGames\Lobby\Games\SlotNew";
    mklink /D "%destinalSrc%\assets\BTGames\Lobby\Games\SlotThiTranMaQuai" "%rootSrc%\assets\BTGames\Lobby\Games\SlotThiTranMaQuai";
    mklink /D "%destinalSrc%\assets\BTGames\Lobby\Games\%projectName%" "%rootSrc%\assets\BTGames\Lobby\Games\%projectName%";

    @REM ==========================REMOVE MKLINK GAME SOURCE======================
    mklink /D "%destinalSrc%\assets\BTGames\SlotThiTranMaQuai" "%rootSrc%\assets\BTGames\SlotThiTranMaQuai";
    mklink /D "%destinalSrc%\assets\BTGames\%projectName%" "%rootSrc%\assets\BTGames\%projectName%";
) ELSE (
  echo Root Project %rootSrc% not exist
)

