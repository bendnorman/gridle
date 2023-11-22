import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { SettingsData } from "../../hooks/useSettings";
import { Tradele } from "../Tradele";
import { formatDistance } from "../../domain/geography";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  return (
    <Panel title="How to play" isOpen={isOpen} close={close}>
      <div className="space-y-3 border-b-2 border-gray-200 pb-3 mb-3">
        <div>
          Guess the <Tradele /> in 6 guesses.
        </div>
        <div>
          What exactly am I trying to guess? Each day you&apos;ll see a
          different stacked area chart of electricity generation by fuel type
          within a US State since 2001.
        </div>
        <div>Each guess must be a US state.</div>
        <div>
          After each guess, you will have the distance, the direction and the
          proximity from your guess and the target state.
        </div>
      </div>
      <div className="space-y-3 border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Examples</div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Alaska",
                direction: "SE",
                distance: 5_742_139,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your guess <span className="uppercase font-bold">Alaska</span> is{" "}
            {formatDistance(5_742_139, settingsData.distanceUnit)} away from the
            target state, the target state is in the South-East direction and
            you have a only 30% of proximity because it&apos;s quite far away!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Virginia",
                direction: "SW",
                distance: 688_799,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your second guess{" "}
            <span className="uppercase font-bold">Virginia</span> is getting
            closer! {formatDistance(688_799, settingsData.distanceUnit)} away,
            South-West direction and 92%!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Georgia",
                direction: "N",
                distance: 0,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Next guess, <span className="uppercase font-bold">Georgia</span>, is
            the correct state! Congrats! 🎉
          </div>
        </div>
      </div>
      <div className="space-y-3 border-b-2 border-gray-200 pb-3 mb-3 font-bold">
        A new <Tradele /> will be available every day!
      </div>
      <div className="space-y-3 border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">About distance</div>
        <div>
          The distances displayed correspond to the distances between the
          selected and the target state centers.
        </div>
        <div>
          For instance, the computed distance between Alabama and Georgia is
          around {formatDistance(318_650, settingsData.distanceUnit)} even if
          they have a common border.
        </div>
      </div>
      <div className="space-y-3 border-b-2 border-gray-200 pb-3 mb-3">
        <Tradele /> has been <span className="font-bold">heavily</span> inspired
        by{" "}
        <a
          className="underline"
          href="https://games.oec.world/en/tradle/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tradle
        </a>{" "}
        created by{" "}
        <a
          className="underline"
          href="https://oec.world/en"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Observatory of Economic Complexity
        </a>{" "}
        which itself was <span className="font-bold">heavily</span> inspired by{" "}
        <a
          className="underline"
          href="https://worldle.teuteuf.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Worldle,
        </a>{" "}
        created by{" "}
        <a
          className="underline"
          href="https://twitter.com/teuteuf"
          target="_blank"
          rel="noopener noreferrer"
        >
          @teuteuf
        </a>{" "}
        and{" "}
        <a
          className="underline"
          href="https://www.powerlanguage.co.uk/wordle/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wordle
        </a>{" "}
        created by{" "}
        <a
          className="underline"
          href="https://twitter.com/powerlanguish"
          target="_blank"
          rel="noopener noreferrer"
        >
          Josh Wardle (@powerlanguish)
        </a>
        .
      </div>
      <div className="space-y-3 pb-3">
        <div>
          Made by{" "}
          <a
            className="underline"
            href="https://twitter.com/bendnorman"
            target="_blank"
            rel="noopener noreferrer"
          >
            @bendnorman
          </a>
          . Source code on{" "}
          <a
            className="underline"
            href="https://github.com/bendnorman/gridle"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          .
        </div>
        <div>
          <a
            className="underline"
            href="https://catalyst.coop/pudl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about the Public Utility Data Liberation Project ⚡
          </a>
        </div>
      </div>
    </Panel>
  );
}
