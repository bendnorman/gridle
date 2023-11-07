import { DateTime, Interval } from "luxon";
import {
  computeProximityPercent,
  generateSquareCharacters,
} from "../domain/geography";

import CopyToClipboard from "react-copy-to-clipboard";
import { Guess } from "../domain/guess";
import React from "react";
import { SettingsData } from "../hooks/useSettings";
import { toast } from "react-toastify";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const START_DATE = DateTime.fromISO("2023-11-05");

interface ShareProps {
  guesses: Guess[];
  dayString: string;
  settingsData: SettingsData;
  hideImageMode: boolean;
  rotationMode: boolean;
  isAprilFools?: boolean;
}

export function Share({
  guesses,
  dayString,
  settingsData,
  hideImageMode,
  rotationMode,
  isAprilFools = false,
}: ShareProps) {
  const { t } = useTranslation();
  const { theme } = settingsData;

  const shareText = useMemo(() => {
    const guessCount =
      guesses[guesses.length - 1]?.distance === 0 ? guesses.length : "X";
    const dayCount = Math.floor(
      Interval.fromDateTimes(START_DATE, new Date(dayString)).length("day")
    );
    const difficultyModifierEmoji = hideImageMode
      ? " 🙈"
      : rotationMode
      ? " 🌀"
      : "";
    const title = isAprilFools
      ? `#Gridle #AprilFoolsDay #${dayCount} ${guessCount}/6${difficultyModifierEmoji}`
      : `#Gridle #${dayCount} ${guessCount}/6${difficultyModifierEmoji}`;

    const guessString = guesses
      .map((guess) => {
        const percent = computeProximityPercent(guess.distance);
        return generateSquareCharacters(percent, theme).join("");
      })
      .join("\n");

    return [title, guessString, "https://catalyst.coop/pudl"].join("\n");
  }, [dayString, guesses, hideImageMode, rotationMode, theme, isAprilFools]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast(t("copy"))}
      options={{
        format: "text/plain",
      }}
    >
      <button className="p-2 mt-4 rounded-lg font-semibold bg-oec-orange hover:bg-oec-yellow active:bg-oec-orange text-white w-full">
        {t("share")}
      </button>
    </CopyToClipboard>
  );
}
