"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  CakeSlice,
  Eye,
  EyeOff,
  PartyPopper,
  Volume2,
  VolumeX,
} from "lucide-react";
import { giftContent } from "@/lib/gift-content";

type Chapter = "cover" | "note" | "film" | "memories" | "ending";
const chapters: Chapter[] = ["cover", "note", "film", "memories", "ending"];
const [birthdayDay, birthdayMonth] = giftContent.birthdayDate.split(/\s+/, 2);
const birthdayDayParts = birthdayDay.match(/^(\d+)(st|nd|rd|th)$/i);
const confettiPieces = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  x: `${((index * 83) % 460) - 230}px`,
  y: `${100 + ((index * 47) % 230)}px`,
  spin: `${((index * 137) % 720) - 360}deg`,
  delay: `${(index % 8) * 24}ms`,
  color: ["pink", "yellow", "mint", "orange", "blue"][index % 5],
}));

export function GiftExperience() {
  const [chapter, setChapter] = useState<Chapter>("cover");
  const [noteLine, setNoteLine] = useState(0);
  const [memoryIndex, setMemoryIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const goTo = useCallback((nextChapter: Chapter) => {
    if (nextChapter === "memories") setMemoryIndex(0);
    if (nextChapter === "note") setNoteLine(0);
    setShowVideo(false);
    setChapter(nextChapter);
    setConfettiKey((key) => key + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToPreviousChapter = useCallback(() => {
    const previousChapter =
      chapters[Math.max(chapters.indexOf(chapter) - 1, 0)];
    goTo(previousChapter);
  }, [chapter, goTo]);

  const next = useCallback(() => {
    if (chapter === "note" && noteLine < giftContent.note.length - 1) {
      setNoteLine((line) => line + 1);
      return;
    }
    if (
      chapter === "memories" &&
      memoryIndex < giftContent.memories.length - 1
    ) {
      setMemoryIndex((index) => index + 1);
      return;
    }
    const position = chapters.indexOf(chapter);
    if (position < chapters.length - 1) goTo(chapters[position + 1]);
  }, [chapter, goTo, memoryIndex, noteLine]);

  const previous = useCallback(() => {
    if (chapter === "memories" && memoryIndex > 0) {
      setMemoryIndex((index) => index - 1);
      return;
    }
    if (chapter === "note" && noteLine > 0) {
      setNoteLine((line) => line - 1);
      return;
    }
    const position = chapters.indexOf(chapter);
    if (position > 0) goTo(chapters[position - 1]);
  }, [chapter, goTo, memoryIndex, noteLine]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isUnlocked) return;
      if (showPhoto) {
        if (event.key === "Escape") setShowPhoto(false);
        if (event.key === "ArrowRight")
          setMemoryIndex((idx) =>
            Math.min(idx + 1, giftContent.memories.length - 1),
          );
        if (event.key === "ArrowLeft")
          setMemoryIndex((idx) => Math.max(idx - 1, 0));
        return;
      }
      if (showVideo) {
        if (event.key === "Escape") setShowVideo(false);
        return;
      }
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isUnlocked, next, previous]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === giftContent.password) {
      setLoginError("");
      setIsUnlocked(true);
      setConfettiKey((key) => key + 1);
      return;
    }
    setLoginError("That isn’t quite it. Try again.");
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !giftContent.musicUrl) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const memory = giftContent.memories[memoryIndex];
  const chapterProgress = chapters.indexOf(chapter);
  const hasAudio = Boolean(giftContent.musicUrl);

  if (!isUnlocked) {
    return (
      <main className="login-shell">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-content">
            <h1 id="login-title">
              You&apos;re INVITED,
              <br />
              <span>{giftContent.recipient}!</span>
            </h1>
            <p className="login-intro">A surprise is waiting for YOU.</p>
            <form className="login-form" onSubmit={handleLogin}>
              <label htmlFor="birthday-password">Password</label>
              <div className="password-field">
                <input
                  id="birthday-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setLoginError("");
                  }}
                  aria-describedby={loginError ? "login-error" : undefined}
                  aria-invalid={Boolean(loginError)}
                  required
                />
                <button
                  className="password-visibility"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </button>
              </div>
              {loginError && (
                <p className="login-error" id="login-error" role="alert">
                  {loginError}
                </p>
              )}
              <button className="login-submit" type="submit">
                Open your surprise <ArrowRight aria-hidden="true" />
              </button>
            </form>
          </div>
          <div
            className="login-art"
            role="img"
            aria-label="A colorful birthday cake illustration with the date 11th November printed on the canvas"
          >
            <Image
              src="./4.jpeg"
              alt=""
              fill
              priority
              sizes="(max-width: 600px) 100vw, 380px"
            />
            <span className="login-art-stamp" aria-hidden="true">
              {giftContent.birthdayDate}
            </span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main
      className={`gift-shell chapter-${chapter}`}
      onPointerDown={(event) => {
        if (showPhoto || showVideo) {
          swipeStart.current = null;
          return;
        }
        const target = event.target as HTMLElement;
        if (
          event.pointerType === "mouse" ||
          target.closest("button, a, input, video, audio")
        )
          return;
        swipeStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerUp={(event) => {
        if (showPhoto || showVideo) {
          swipeStart.current = null;
          return;
        }
        if (!swipeStart.current) return;
        const deltaX = event.clientX - swipeStart.current.x;
        const deltaY = event.clientY - swipeStart.current.y;
        swipeStart.current = null;
        if (Math.abs(deltaX) < 64 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25)
          return;
        if (deltaX < 0) next();
        else previous();
      }}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
    >
      <audio
        ref={audioRef}
        src={hasAudio ? giftContent.musicUrl : undefined}
        loop
        preload="none"
      />
      {confettiKey > 0 && (
        <div className="confetti-burst" key={confettiKey} aria-hidden="true">
          {confettiPieces.map((piece) => (
            <span
              className={`confetti-piece confetti-${piece.color}`}
              key={piece.id}
              style={
                {
                  "--tx": piece.x,
                  "--ty": piece.y,
                  "--spin": piece.spin,
                  "--delay": piece.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}
      <div className="ambient-glow" aria-hidden="true" />
      {!showPhoto && !showVideo && (
      <header className="gift-header">
        <a
          className="wordmark"
          href="#top"
          onClick={(event) => {
            event.preventDefault();
            goTo("cover");
          }}
          aria-label="Return to the beginning"
        >
          <PartyPopper className="wordmark-mark" aria-hidden="true" />
          <span>A little birthday surprise</span>
        </a>
        <div className="header-right">
          {hasAudio && (
            <button
              className="sound-button"
              type="button"
              onClick={toggleAudio}
              aria-label={
                playing ? "Pause background music" : "Play background music"
              }
            >
              {playing ? (
                <Volume2 aria-hidden="true" />
              ) : (
                <VolumeX aria-hidden="true" />
              )}
              <span>{playing ? "Sound on" : "Sound off"}</span>
            </button>
          )}
        </div>
      </header>
      )}

      {chapter !== "cover" && !showPhoto && !showVideo && (
        <>
          <div className="chapter-date-art" aria-hidden="true">
            <span className="chapter-date-day">
              {birthdayDayParts?.[1] ?? birthdayDay}
              {birthdayDayParts?.[2] && <sup>{birthdayDayParts[2]}</sup>}
            </span>
            <span className="chapter-date-month">{birthdayMonth}</span>
          </div>
          <div className="chapter-back-row">
            <button
              className="chapter-back"
              type="button"
              onClick={goToPreviousChapter}
              aria-label={`Back to ${chapters[Math.max(chapters.indexOf(chapter) - 1, 0)]}`}
            >
              <ArrowLeft aria-hidden="true" />
            </button>
          </div>
        </>
      )}

      {chapter === "cover" && (
        <section className="cover-scene" id="top" aria-labelledby="cover-title">
          <div className="cover-copy">
            <p className="eyebrow">
              <span className="eyebrow-dash" /> TODAY IS ALL ABOUT YOU
            </p>
            <h1 id="cover-title">
              Happy birthday,
              <br />
              <span>{giftContent.recipient}!</span>
            </h1>
            <p className="cover-intro">{giftContent.openingLine}</p>
            <button
              className="open-gift-button"
              type="button"
              onClick={() => goTo("note")}
            >
              <span>Open your surprise</span>
              <ArrowRight aria-hidden="true" />
            </button>
            <p className="cover-whisper">
              Cake calories don&apos;t count today.
            </p>
          </div>
          <div className="cover-art-wrap">
            <span className="party-balloon balloon-one" aria-hidden="true" />
            <span className="party-balloon balloon-two" aria-hidden="true" />
            <div
              className="cover-art"
              onPointerMove={(event) => {
                if (event.pointerType !== "mouse") return;
                const bounds = event.currentTarget.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                event.currentTarget.style.setProperty(
                  "--tilt-x",
                  `${-y * 8}deg`,
                );
                event.currentTarget.style.setProperty(
                  "--tilt-y",
                  `${x * 10}deg`,
                );
              }}
              onPointerLeave={(event) => {
                event.currentTarget.style.setProperty("--tilt-x", "0deg");
                event.currentTarget.style.setProperty("--tilt-y", "0deg");
              }}
            >
              <Image
                src="/birthday-cover.png"
                alt="A bright illustrated birthday cake surrounded by balloons, stars, and confetti"
                fill
                priority
                sizes="(max-width: 760px) 90vw, 54vw"
              />
              <div className="cover-art-overlay" />
              <span className="cover-art-sticker">
                <CakeSlice aria-hidden="true" /> Let&apos;s celebrate!
              </span>
              <div className="cover-art-caption">
                <span>MADE WITH LOVE</span>
                <span>A VERY HAPPY BIRTHDAY</span>
              </div>
            </div>
            <span className="art-side-note">A whole lot of happy.</span>
          </div>
          <div className="cover-bottom">
            <span>TAKE YOUR TIME</span>
            <span>
              SCROLL ISN&apos;T REQUIRED <ArrowDown aria-hidden="true" />
            </span>
          </div>
        </section>
      )}

      {chapter === "note" && (
        <section
          className="chapter-scene note-scene"
          aria-labelledby="note-title"
        >
          <div className="chapter-aside">
            <span className="eyebrow">
              <span>A NOTE, JUST FOR YOU</span>
              <span className="aside-index">
                <span aria-hidden="true">—</span> 01-04
              </span>
            </span>
          </div>
          <div className="note-content">
            <p className="eyebrow note-to">
              DEAR {giftContent.recipient.toUpperCase()},
            </p>
            <h2 id="note-title" className="note-line" key={noteLine}>
              {giftContent.note[noteLine]}
            </h2>
            <div className="note-lower">
              <span className="handwritten-mark">
                <pre>
                You are my best friend, my greatest<br></br>
                confidant, and the love of my life.<br></br>
                With you, I've found my forever<br></br>
                and my always.<br></br>
                I am so grateful for every moment we share,<br></br>
                and every moment we make. <br></br>
                You are my heart, my soul, my everything.
                </pre>
              </span>
            </div>
            <div
              className="line-progress"
              aria-label={`Note, line ${noteLine + 1} of ${giftContent.note.length}`}
            >
              {giftContent.note.map((_, index) => (
                <span
                  key={index}
                  className={index <= noteLine ? "is-active" : ""}
                />
              ))}
            </div>
            <button
              className="scene-next"
              type="button"
              onClick={next}
              aria-label={
                noteLine < giftContent.note.length - 1
                  ? "Read the next line"
                  : "Continue to the video"
              }
            >
              {noteLine < giftContent.note.length - 1
                ? "Next line"
                : "Continue"}{" "}
              <ArrowRight aria-hidden="true" />
            </button>
          </div>
        </section>
      )}

      {chapter === "film" && (
        <section
          className="chapter-scene film-scene"
          aria-labelledby="film-title"
        >
          {!showVideo && (
            <>
              <div className="chapter-aside">
                <span className="eyebrow">
                  <span>SOMETHING TO WATCH</span>
                  <span className="aside-index">
                    <span aria-hidden="true">—</span> 02-04
                  </span>
                </span>
              </div>
              <div className="film-content">
                <div className="film-heading">
                  <p className="eyebrow">A LITTLE DETOUR</p>
                  <h2 id="film-title">
                    {giftContent.video.title}
                    <span>.</span>
                  </h2>
                  <p>{giftContent.video.description}</p>
                </div>
                <button
                  className="film-frame"
                  type="button"
                  onClick={() => setShowVideo(true)}
                  aria-label="Open fullscreen film"
                >
                  <Image
                    src={giftContent.video.poster}
                    alt="Sample still for the personal birthday video"
                    fill
                    sizes="(max-width: 760px) 92vw, 66vw"
                  />
                  <span className="film-frame-shade" />
                  {giftContent.videoUrl ? (
                    <span className="play-button" aria-hidden="true">
                      ▶
                    </span>
                  ) : (
                    <span className="film-placeholder-label">
                      YOUR FILM GOES HERE
                    </span>
                  )}
                  <span className="film-frame-note">
                    {giftContent.videoUrl
                      ? "TAKE A BREATH. PRESS PLAY."
                      : "ADD A VIDEO URL IN lib/gift-content.ts"}
                  </span>
                </button>
                <div className="film-footer">
                  <span>Just you, me, and a few seconds.</span>
                </div>
                <button
                  className="scene-next"
                  type="button"
                  onClick={() => goTo("memories")}
                  aria-label="Continue to your memories"
                >
                  Continue <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </>
          )}
          {showVideo && (
            <div
              className="video-lightbox cinema-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Birthday film fullscreen"
              onClick={() => setShowVideo(false)}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              <div className="lightbox-header">
                <span className="lightbox-badge">BIRTHDAY FILM</span>
                <button
                  className="video-close"
                  type="button"
                  onClick={() => setShowVideo(false)}
                >
                  Close <span aria-hidden="true">×</span>
                </button>
              </div>
              <div
                className="cinema-frame"
                onClick={(event) => event.stopPropagation()}
              >
                {giftContent.videoUrl ? (
                  <video
                    src={giftContent.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    onEnded={() =>
                      window.setTimeout(() => setShowVideo(false), 1600)
                    }
                  />
                ) : (
                  <div className="cinema-placeholder">
                    <Image
                      src={giftContent.video.poster}
                      alt="Film preview poster"
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 900px) 92vw, 880px"
                    />
                    <div className="cinema-placeholder-overlay">
                      <div className="cinema-play-ring">
                        <span className="play-triangle">▶</span>
                      </div>
                      <h3>{giftContent.video.title}</h3>
                      <p>{giftContent.video.description}</p>
                      <span className="cinema-note">
                        Add your video URL in <code>lib/gift-content.ts</code>{" "}
                        to play
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {chapter === "memories" && (
        <section
          className="chapter-scene memories-scene"
          aria-labelledby="memories-title"
        >
          {!showPhoto && (
            <>
              <div className="chapter-aside">
            <span className="eyebrow">
              <span>A FEW THINGS I KEPT</span>
              <span className="aside-index">
                <span aria-hidden="true">—</span> 03-04
              </span>
            </span>
          </div>
          <div className={`memory-stage memory-${memory.composition}`}>
            <div className="memory-heading">
              <p className="eyebrow">Memories</p>
              <h2 id="memories-title">
                A few of <em>us.</em>
              </h2>
            </div>
            <figure
              className="memory-photo"
              key={memoryIndex}
              onClick={() => setShowPhoto(true)}
              style={{ cursor: "zoom-in" }}
            >
              <Image
                src={memory.image}
                alt={memory.alt}
                fill
                sizes="(max-width: 760px) 86vw, 54vw"
                priority={memoryIndex === 0}
                draggable={false}
              />
              <span className="photo-number">
                {String(memoryIndex + 1).padStart(2, "0")} <i>/</i>{" "}
                {String(giftContent.memories.length).padStart(2, "0")}
              </span>
              <span className="photo-tap-hint">TAP TO EXPAND</span>
            </figure>
            <div className="memory-caption" key={`caption-${memoryIndex}`}>
              <p className="caption-main">{memory.caption}</p>
              {memory.note && <p className="caption-note">{memory.note}</p>}
            </div>
            <div className="memory-controls">
              <button
                type="button"
                onClick={() =>
                  setMemoryIndex((index) => Math.max(index - 1, 0))
                }
                disabled={memoryIndex === 0}
                aria-label="Previous memory"
              >
                <ArrowLeft aria-hidden="true" />
              </button>
              <div
                className="memory-dots"
                role="group"
                aria-label="Choose a memory"
              >
                {giftContent.memories.map((_, index) => (
                  <button
                    type="button"
                    key={index}
                    className={index === memoryIndex ? "active" : ""}
                    onClick={() => setMemoryIndex(index)}
                    aria-label={`Show memory ${index + 1}`}
                    aria-current={index === memoryIndex ? "step" : undefined}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setMemoryIndex((index) =>
                    Math.min(index + 1, giftContent.memories.length - 1),
                  )
                }
                disabled={memoryIndex === giftContent.memories.length - 1}
                aria-label="Next memory"
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
            {memoryIndex === giftContent.memories.length - 1 && (
              <button
                className="memory-finish"
                type="button"
                onClick={() => goTo("ending")}
              >
                One last thing <ArrowRight aria-hidden="true" />
              </button>
            )}
          </div>
          </>
        )}
        {showPhoto && (
            <div
              className="video-lightbox coverflow-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Cover Flow photo gallery"
              onClick={() => setShowPhoto(false)}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
            >
              <div
                className="coverflow-top-bar"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="coverflow-title-wrap">
                  <span className="coverflow-label">Cover Flow</span>
                  <span className="coverflow-counter">
                    {String(memoryIndex + 1).padStart(2, "0")} <i>/</i>{" "}
                    {String(giftContent.memories.length).padStart(2, "0")}
                  </span>
                </div>
                <button
                  className="video-close"
                  type="button"
                  onClick={() => setShowPhoto(false)}
                >
                  Close <span aria-hidden="true">×</span>
                </button>
              </div>

              <button
                className="lightbox-nav lightbox-prev"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMemoryIndex((index) => Math.max(index - 1, 0));
                }}
                disabled={memoryIndex === 0}
                aria-label="Previous photo"
              >
                <ArrowLeft aria-hidden="true" />
              </button>

              <div
                className="coverflow-stage"
                onClick={(event) => event.stopPropagation()}
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  swipeStart.current = { x: touch.clientX, y: touch.clientY };
                }}
                onTouchEnd={(e) => {
                  if (!swipeStart.current) return;
                  const touch = e.changedTouches[0];
                  const diffX = touch.clientX - swipeStart.current.x;
                  swipeStart.current = null;
                  if (diffX > 40) setMemoryIndex((idx) => Math.max(idx - 1, 0));
                  else if (diffX < -40)
                    setMemoryIndex((idx) =>
                      Math.min(idx + 1, giftContent.memories.length - 1),
                    );
                }}
              >
                <div className="coverflow-track">
                  {giftContent.memories.map((mem, i) => {
                    const offset = i - memoryIndex;
                    const absOffset = Math.abs(offset);
                    const isCenter = offset === 0;

                    return (
                      <div
                        key={i}
                        className={`coverflow-card ${isCenter ? "is-active" : ""} ${offset < 0 ? "is-left" : ""} ${offset > 0 ? "is-right" : ""}`}
                        style={
                          {
                            "--offset": offset,
                            "--abs-offset": absOffset,
                            zIndex: 50 - absOffset,
                          } as React.CSSProperties
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          setMemoryIndex(i);
                        }}
                      >
                        <div className="coverflow-card-inner">
                          <Image
                            src={mem.image}
                            alt={mem.alt}
                            fill
                            priority={isCenter}
                            sizes="(max-width: 640px) 68vw, 420px"
                            draggable={false}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="coverflow-caption-block" key={memoryIndex}>
                  <p className="coverflow-caption-main">{memory.caption}</p>
                  {memory.note && (
                    <p className="coverflow-caption-sub">{memory.note}</p>
                  )}
                </div>
              </div>

              <button
                className="lightbox-nav lightbox-next"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMemoryIndex((index) =>
                    Math.min(index + 1, giftContent.memories.length - 1),
                  );
                }}
                disabled={memoryIndex === giftContent.memories.length - 1}
                aria-label="Next photo"
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      )}

      {chapter === "ending" && (
        <section className="ending-scene" aria-labelledby="ending-title">
          <div className="ending-memory">
            <Image
              src={memory.image}
              alt={memory.alt}
              fill
              sizes="(max-width: 760px) 100vw, 100vw"
              priority
            />
          </div>
          <div className="ending-wash" />
          <div className="ending-message">
            <p className="eyebrow">AND MOST OF ALL</p>
            <h2 id="ending-title">
              Happy birthday,
              <br />
              <em>{giftContent.recipient}.</em>
            </h2>
            <span className="ending-rule" />
            <p className="signoff">{giftContent.signoff}</p>
            <p className="signature">{giftContent.sender}</p>
            <button
              className="ending-restart"
              type="button"
              onClick={() => goTo("cover")}
            >
              Start over <ArrowRight aria-hidden="true" />
            </button>
            <p className="ending-footnote">Enjoy your day</p>
          </div>
        </section>
      )}

      {!showPhoto && !showVideo && (
      <footer className="gift-footer">
        <span>MADE FOR {giftContent.recipient.toUpperCase()}</span>
        <div
          className="footer-progress"
          aria-label={`Chapter ${chapterProgress + 1} of ${chapters.length}`}
        >
          {chapters.map((item, index) => (
            <span
              key={item}
              className={index <= chapterProgress ? "is-active" : ""}
            />
          ))}
        </div>
        <span className="footer-small">{giftContent.birthdayDate}</span>
      </footer>
      )}
    </main>
  );
}

export default GiftExperience;
