"use client";

import { useEffect, useState } from "react";

type Reward = {
  threshold: number;
  step: string;
  image: string;
  progressImage?: string;
  progressImageOverlay?: string;
  title: string;
  remaining: string;
};

type TrackPoint = {
  threshold: number;
  label: string;
  kind: "empty" | "reward";
};

const rewards: Reward[] = [
  {
    threshold: 3,
    step: "สะสมครบ 3 ดวง",
    image: "/m-card/reward-oh-juice.png",
    progressImage: "/m-card/progress-reward-thumb.png",
    progressImageOverlay: "/m-card/progress-reward-thumb-overlay.png",
    title: "คูปองส่วนลดร้าน OH JUICE\nมูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 207/800",
  },
  {
    threshold: 5,
    step: "สะสมครบ 5 ดวง",
    image: "/m-card/reward-starbucks.png",
    title: "คูปอง STARBUCKS มูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 399/1,000",
  },
  {
    threshold: 7,
    step: "สะสมครบ 7 ดวง",
    image: "/m-card/reward-sushiro.png",
    title: "คูปอง SUSHIRO มูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 130/550",
  },
  {
    threshold: 10,
    step: "สะสมครบ 10 ดวง",
    image: "/m-card/reward-cash-200.png",
    progressImage: "/m-card/progress-reward-thumb-200.png",
    progressImageOverlay: "/m-card/progress-reward-thumb-200-overlay.png",
    title: "รับ CASH COUPON\nสำหรับอิ่มในศูนย์ฯ มูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 258/600",
  },
  {
    threshold: 12,
    step: "สะสมครบ 12 ดวง",
    image: "/m-card/reward-yakiniku.png",
    title: "คูปอง เนื้อคารูบิ 50 กรัม หรือ หมูคารูบิ 50 กรัม ร้าน YAKINIKU LIKE",
    remaining: "ผู้ใช้สิทธิ์ครบแล้ว",
  },
  {
    threshold: 15,
    step: "สะสมครบ 15 ดวง",
    image: "/m-card/reward-chagee.png",
    title: "คูปองส่วนลดร้าน CHAGEE\nมูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 91/600",
  },
  {
    threshold: 17,
    step: "สะสมครบ 17 ดวง",
    image: "/m-card/reward-mk.png",
    title: "คูปองส่วนลดร้าน MK RESTAURANTS\nมูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 33/500",
  },
  {
    threshold: 17,
    step: "สะสมครบ 17 ดวง",
    image: "/m-card/reward-katei.png",
    title: "คูปองส่วนลดร้าน KATEI SHABU\nมูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 87/290",
  },
  {
    threshold: 20,
    step: "สะสมครบ 20 ดวง",
    image: "/m-card/reward-cash-500.png",
    title: "รับ CASH COUPON\nสำหรับอิ่มในศูนย์ฯ มูลค่า 500 บาท",
    remaining: "จำนวนสิทธิ์ 146/300",
  },
];

const campaignTerms = [
  "กดปุ่ม “เข้าร่วมภารกิจ” ในหน้ารายละเอียดภารกิจ ระบบจะเริ่มนับดวงให้อัตโนมัติ",
  "ยอดใช้จ่ายก่อนกดเข้าร่วมภารกิจ จะไม่ถูกนำมานับ",
  "นับจากยอดใช้จ่ายต่อ 1 ใบเสร็จ ไม่สามารถนำหลายใบเสร็จมารวมกันได้",
  "เศษของยอดที่ไม่ถึง 400 บาท จะไม่ถูกนำไปสะสมต่อในใบเสร็จถัดไป",
  "ดวงจะเข้าระบบภายใน 3 วันทำการหลังทำรายการ",
  "สะสมได้สูงสุด 20 ดวงตลอดระยะแคมเปญ",
  "รางวัลแบ่งเป็น 8 ขั้น ที่ 3 / 5 / 7 / 10 / 12 / 15 / 17 / 20 ดวง",
  "เมื่อสะสมครบแต่ละขั้น ต้องกดรับรางวัลด้วยตนเองภายในระยะแคมเปญ",
  "ของรางวัลมีจำนวนจำกัด เมื่อสิทธิ์เต็มจะไม่สามารถกดรับได้",
];

export default function Home() {
  const [screen, setScreen] = useState<"list" | "detail">("list");
  const [joined, setJoined] = useState(false);
  const [stars, setStars] = useState(0);
  const [claimedProgressThresholds, setClaimedProgressThresholds] = useState<number[]>([]);
  const [showCollectedRewards, setShowCollectedRewards] = useState(false);
  const [showTermsSheet, setShowTermsSheet] = useState(false);
  const [starBadgeEffect, setStarBadgeEffect] = useState<{ id: number } | null>(null);

  useEffect(() => {
    if (!starBadgeEffect) {
      return;
    }

    const timer = window.setTimeout(() => setStarBadgeEffect(null), 1200);

    return () => window.clearTimeout(timer);
  }, [starBadgeEffect]);

  const handleAddStar = () => {
    if (stars >= 20) {
      return;
    }

    const totalStars = stars + 1;
    setStars(totalStars);
    setStarBadgeEffect({ id: Date.now() });
  };

  const handleJoinMission = () => {
    setJoined(true);
    setStars(0);
    setClaimedProgressThresholds([]);
    setStarBadgeEffect(null);
    setScreen("detail");
  };

  return (
    <main className="prototype-stage">
      <section className="phone-shell" aria-label={screen === "detail" ? "M Card mission detail" : "Shop Mission list"}>
        <div className="top-chrome">
          <div className="status-bar" aria-hidden="true">
            <span className="status-time">9:41</span>
            <div className="status-levels">
              <img src="/m-card/cellular.svg" alt="" className="cellular" />
              <img src="/m-card/wifi.svg" alt="" className="wifi" />
              <div className="battery">
                <span />
                <img src="/m-card/cap.svg" alt="" />
              </div>
            </div>
          </div>

          <header className="app-header">
            <button
              className="icon-button"
              aria-label="ย้อนกลับ"
              onClick={() => {
                if (screen === "detail") {
                  setScreen("list");
                  setShowCollectedRewards(false);
                  setShowTermsSheet(false);
                }
              }}
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M12 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.25"
                />
              </svg>
            </button>
            <h1>{screen === "detail" ? "รายละเอียดภารกิจ" : "Shop Mission"}</h1>
          </header>
        </div>

        {screen === "detail" ? (
          <>
            <img
              src="/m-card/offer.png"
              alt="The Mall Lifestore Eatventure promotion"
              className="offer-image"
            />

            <div className={joined ? "content joined-content" : "content"}>
              <section className="intro">
                <p className="mission-type">SHOP MISSON</p>
                <div className="offer-info">
                  <h2>THE MALL LIFESTORE EATVENTURE</h2>
                  <p className="date">15 ก.ค. 69 – 30 ก.ย. 69</p>
                </div>

                {joined ? (
                  <ProgressCard
                    claimedThresholds={claimedProgressThresholds}
                    stars={stars}
                    starEffectKey={starBadgeEffect?.id}
                    onClaimReward={(threshold) =>
                      setClaimedProgressThresholds((thresholds) =>
                        thresholds.includes(threshold) ? thresholds : [...thresholds, threshold],
                      )
                    }
                    onShowCollected={() => setShowCollectedRewards(true)}
                    onAddStar={handleAddStar}
                    onRemoveStar={() => setStars((value) => Math.max(value - 1, 0))}
                    onReset={() => {
                      setJoined(false);
                      setStars(0);
                      setClaimedProgressThresholds([]);
                      setShowCollectedRewards(false);
                      setShowTermsSheet(false);
                      setStarBadgeEffect(null);
                      setScreen("list");
                    }}
                  />
                ) : (
                  <JoinPrompt />
                )}

                <p className="description">
                  ช้อปร้านอาหารในศูนย์ฯ ครบทุก 400 บาท รับ 1 ดวง สะสมครบตามขั้นเพื่อรับรางวัล
                </p>
                <button className="terms-button" type="button" onClick={() => setShowTermsSheet(true)}>
                  รายละเอียดและเงื่อนไข
                </button>
              </section>

              <section className="rewards" aria-labelledby="rewards-heading">
                <h2 id="rewards-heading">ของรางวัลที่ได้รับ</h2>
                <div className="reward-list">
                  {rewards.map((reward, index) => (
                    <article className="reward-section" key={`${reward.step}-${reward.image}`}>
                      {(index === 0 || rewards[index - 1].step !== reward.step) && (
                        <p className="reward-step">{reward.step}</p>
                      )}
                      <div className="reward-card">
                        <img src={reward.image} alt="" className="reward-image" />
                        <div className="reward-detail">
                          <p className="reward-title">{reward.title}</p>
                          <div className="reward-meta">
                            <span>{reward.remaining}</span>
                            <RewardAction joined={joined} reward={reward} stars={stars} />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            {!joined && (
              <div className="cta-bar">
                <button
                  className="join-button"
                  type="button"
                  onClick={() => {
                    handleJoinMission();
                  }}
                >
                  เข้าร่วมภารกิจ
                </button>
                <p>เข้าร่วมครั้งเดียว ระบบบันทึกความคืบหน้าให้อัตโนมัติ</p>
              </div>
            )}
          </>
        ) : (
          <MissionListPage
            joined={joined}
            onOpenDetail={() => setScreen("detail")}
          />
        )}

        <div className="home-indicator" aria-hidden="true">
          <span />
        </div>

        {showCollectedRewards && (
          <CollectedRewardsSheet
            stars={stars}
            onClose={() => setShowCollectedRewards(false)}
          />
        )}

        {showTermsSheet && (
          <TermsSheet onClose={() => setShowTermsSheet(false)} />
        )}

      </section>
    </main>
  );
}

const missionCards = [
  {
    image: "/m-card/mission-sabina.png",
    title: "SABINA STAR CATCHER\nภารกิจพิชิตดาว",
    date: "1 มิ.ย. 69 – 31 ส.ค. 69",
    remaining: "ของรางวัลคงเหลือรวม 31 สิทธิ์",
    limit: "จำกัดสิทธิ์ 70 สิทธิ์",
  },
  {
    image: "/m-card/mission-gourmet.png",
    title: "GOURMET EATS ช้อปครบ 3 ระดับ\nรับรางวัลสุมคุ้ม",
    date: "1 ส.ค. 69 – 30 ก.ย. 69",
    remaining: "ของรางวัลคงเหลือรวม 65 สิทธิ์",
    limit: "จำกัดสิทธิ์ 80 สิทธิ์",
  },
  {
    image: "/m-card/mission-food-waste.png",
    title: "STOP FOOD WASTE กินดี รักษ์โลก\nรับโชคเพิ่ม",
    date: "5 มิ.ย. 69 – 31 ส.ค. 69",
    remaining: "ของรางวัลคงเหลือรวม 5,752 สิทธิ์",
    limit: "จำกัดสิทธิ์ 5,740 สิทธิ์",
  },
];

function MissionListPage({
  joined,
  onOpenDetail,
}: {
  joined: boolean;
  onOpenDetail: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "joined">("all");
  const showingJoinedOnly = activeTab === "joined";

  return (
    <div className="mission-list-page">
      <section className="promo-banner" aria-label="โปรโมชัน">
        <img src="/m-card/list-banner.png" alt="" />
        <div className="banner-dots" aria-hidden="true">
          <span className="active" />
          <span />
          <span />
        </div>
      </section>

      <div className="segmented-tabs" role="tablist" aria-label="ประเภทภารกิจ">
        <button
          aria-selected={activeTab === "all"}
          className={activeTab === "all" ? "active" : ""}
          role="tab"
          type="button"
          onClick={() => setActiveTab("all")}
        >
          ทั้งหมด
        </button>
        <button
          aria-selected={showingJoinedOnly}
          className={showingJoinedOnly ? "active" : ""}
          role="tab"
          type="button"
          onClick={() => setActiveTab("joined")}
        >
          เข้าร่วมแล้ว ({joined ? 1 : 0})
        </button>
      </div>

      <section className="mission-list" aria-label="รายการภารกิจ">
        {!showingJoinedOnly && missionCards.map((mission) => (
          <article className="mission-card" key={mission.title}>
            <div className="mission-card-header">
              <img src={mission.image} alt="" />
              <div>
                <h2>{mission.title}</h2>
                <p>{mission.date}</p>
              </div>
            </div>
            <div className="mission-meta-strip">
              <div>
                <strong>{mission.remaining}</strong>
                <span>{mission.limit}</span>
              </div>
              <button type="button">เข้าร่วม</button>
            </div>
          </article>
        ))}

        {(!showingJoinedOnly || joined) && (
          <EatventureMissionCard
            joined={joined}
            onOpenDetail={onOpenDetail}
          />
        )}

        {showingJoinedOnly && !joined && (
          <div className="mission-empty-state">
            <p>ยังไม่มีภารกิจที่เข้าร่วม</p>
          </div>
        )}
      </section>
    </div>
  );
}

function EatventureMissionCard({
  joined,
  onOpenDetail,
}: {
  joined: boolean;
  onOpenDetail: () => void;
}) {
  return (
    <article className="mission-card is-featured" onClick={onOpenDetail}>
      <div className="mission-card-header">
        <img src="/m-card/mission-eatventure.png" alt="" />
        <div>
          <h2>THE MALL LIFESTORE EATVENTURE</h2>
          <p>16 – 31 ก.ค. 69</p>
        </div>
      </div>
      {joined && (
        <div className="mission-mini-progress" aria-hidden="true">
          <div className="mini-track-rail">
            <span />
          </div>
          <div className="mini-track-points">
            {[
              { threshold: 0, label: "" },
              { threshold: 3, label: "3 ดวง" },
              { threshold: 5, label: "5 ดวง" },
              { threshold: 7, label: "7 ดวง" },
            ].map((point) => (
              <div className={point.threshold === 0 ? "mini-point is-empty" : "mini-point"} key={point.threshold}>
                <span>
                  {point.threshold > 0 && <img src="/m-card/locked-gift.svg" alt="" />}
                </span>
                <p>{point.label}</p>
              </div>
            ))}
          </div>
          <div className="mini-more-tiers">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      <div className="mission-meta-strip">
        <div>
          <strong>ของรางวัลคงเหลือรวม 3,777 สิทธิ์</strong>
          <span>{joined ? "เข้าร่วมแล้ว" : "จำกัดสิทธิ์ 3,777 สิทธิ์"}</span>
        </div>
        {!joined && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onOpenDetail();
            }}
          >
            เข้าร่วม
          </button>
        )}
      </div>
    </article>
  );
}

function TermsSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="terms-sheet"
        aria-label="รายละเอียดแคมเปญ"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <button className="terms-close" type="button" onClick={onClose} aria-label="ปิดรายละเอียดแคมเปญ">
          <img src="/m-card/terms-close.svg" alt="" />
        </button>
        <h2>รายละเอียดแคมเปญ</h2>
        <p className="terms-summary">
          ช้อปร้านอาหารในศูนย์ฯ ครบทุก 400 บาท รับ 1 ดวง สะสมครบตามขั้นเพื่อรับรางวัล
        </p>
        <ul className="terms-list">
          {campaignTerms.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function RewardAction({
  joined,
  reward,
  stars,
}: {
  joined: boolean;
  reward: Reward;
  stars: number;
}) {
  if (!joined) {
    return (
      <button className="reward-pill locked" type="button">
        ยังไม่ปลดล็อก
      </button>
    );
  }

  if (stars < reward.threshold) {
    return (
      <button className="reward-pill pending" type="button">
        อีก {reward.threshold - stars} ดวง
      </button>
    );
  }

  if (reward.remaining === "ผู้ใช้สิทธิ์ครบแล้ว") {
    return (
      <button className="reward-pill locked" type="button">
        สิทธิ์หมด
      </button>
    );
  }

  return (
    <button className="reward-pill active" type="button">
      รับรางวัล
    </button>
  );
}

function JoinPrompt() {
  return (
    <div className="join-card">
      <h3>เข้าร่วมเพื่อเริ่มภารกิจ</h3>
      <p>
        ใช้จ่ายร้านอาหารในศูนย์ฯ ครบทุก 400 บาท รับ 1 ดวง แลกรางวัลได้สูงสุด 9 รายการ
      </p>
    </div>
  );
}

function ProgressCard({
  claimedThresholds,
  stars,
  starEffectKey,
  onClaimReward,
  onShowCollected,
  onAddStar,
  onRemoveStar,
  onReset,
}: {
  claimedThresholds: number[];
  stars: number;
  starEffectKey?: number;
  onClaimReward: (threshold: number) => void;
  onShowCollected: () => void;
  onAddStar: () => void;
  onRemoveStar: () => void;
  onReset: () => void;
}) {
  const claimableReward = rewards.find(
    (reward) => stars >= reward.threshold && !claimedThresholds.includes(reward.threshold),
  );
  const displayReward =
    claimableReward ??
    rewards.find((reward) => reward.threshold > stars) ??
    rewards[rewards.length - 1];
  const remainingStars = Math.max(displayReward.threshold - stars, 0);
  const canClaimDisplayedReward = Boolean(claimableReward);
  const trackPoints = getTrackPoints(stars);
  const progressPercent = getTrackProgressPercent(stars, trackPoints);
  const progressRatio = progressPercent / 100;
  const isEmptyProgress = stars === 0;
  const hasMoreTiers = trackPoints[trackPoints.length - 1].threshold < 20;
  const trackRange = hasMoreTiers ? "100% - 70px" : "100% - 28px";

  return (
    <div className="progress-group">
      <div className="progress-card" aria-label="ความคืบหน้าภารกิจ">
        <div className="progress-header">
          <h3>สะสมแล้ว {stars}/20 ดวง</h3>
          <button type="button" onClick={onShowCollected}>
            ดูทั้งหมด
          </button>
        </div>

        <div className={hasMoreTiers ? "progress-track has-more-tiers" : "progress-track"} aria-hidden="true">
          <div className="track-rail">
            <span />
          </div>
          {!isEmptyProgress && (
            <>
              <div
                className="track-done"
                style={{ width: `calc((${trackRange}) * ${progressRatio})` }}
              />
              <div
                className="current-flag"
                style={{ left: `calc(14px + (${trackRange}) * ${progressRatio})` }}
              >
                {starEffectKey && (
                  <div className="star-badge-effect" key={starEffectKey}>
                    <img
                      src="/m-card/star-v1-transparent.gif"
                      alt=""
                    />
                    <strong>+1</strong>
                  </div>
                )}
                <span>{stars}</span>
                <i />
              </div>
            </>
          )}

          <div className="track-points">
            {trackPoints.map((point) => {
              const isClaimed = point.kind === "reward" && stars >= point.threshold;

              return (
                <div
                  className={`track-point ${point.kind === "empty" ? "is-empty" : ""} ${
                    isClaimed ? "is-claimed" : ""
                  }`}
                  key={point.threshold}
                >
                  <span>
                    {point.kind === "reward" && (
                      <img src={isClaimed ? "/m-card/claimed-gift.svg" : "/m-card/locked-gift.svg"} alt="" />
                    )}
                  </span>
                  <p>{point.label}</p>
                </div>
              );
            })}
          </div>
          {hasMoreTiers && (
            <div className="more-tiers-inline" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className="progress-divider" />

        <div className="next-reward">
          <div className="next-reward-thumb">
            <img src={displayReward.progressImage ?? displayReward.image} alt="" />
            {displayReward.progressImageOverlay && (
              <img src={displayReward.progressImageOverlay} alt="" />
            )}
          </div>
          <div className="next-reward-text">
            <p>{canClaimDisplayedReward ? "ปลดล็อกแล้ว" : "รางวัลถัดไป"}</p>
            <h4>{displayReward.title.replace("\n", " ")}</h4>
          </div>
          <button
            className={canClaimDisplayedReward ? "next-pill active" : "next-pill"}
            type="button"
            onClick={() => {
              if (canClaimDisplayedReward) {
                onClaimReward(displayReward.threshold);
              }
            }}
          >
            {canClaimDisplayedReward ? "รับรางวัล" : `อีก ${remainingStars} ดวง`}
          </button>
        </div>
      </div>

      <div className="tester-controls" aria-label="ตัวช่วยทดสอบจำนวนดาว">
        <button type="button" onClick={onRemoveStar} disabled={stars === 0}>
          - ดาว
        </button>
        <button type="button" onClick={onAddStar} disabled={stars === 20}>
          + ดาว
        </button>
        <button type="button" onClick={onReset}>
          รีเซ็ต
        </button>
      </div>
    </div>
  );
}

function CollectedRewardsSheet({
  stars,
  onClose,
}: {
  stars: number;
  onClose: () => void;
}) {
  const milestones = [0, ...getRewardGroups().map((group) => group.threshold)];
  const unlockedCount = milestones.filter((milestone) => milestone > 0 && stars >= milestone).length;
  const nextMilestone = milestones.find((milestone) => milestone > stars && milestone > 0);
  const rewardGroups = getRewardGroups();

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section
        className="collected-sheet"
        aria-label="Progress สะสม"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="sheet-header">
          <div>
            <h2>Progress สะสม</h2>
            <p>
              ปลดล็อกแล้ว {unlockedCount}/8 ขั้น
              {nextMilestone ? ` · อีก ${nextMilestone - stars} ดวงถึงขั้นถัดไป` : " · ครบทุกขั้นแล้ว"}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="ปิดรายการรางวัล">
            ปิด
          </button>
        </header>

        <div className="sheet-progress-summary">
          <div className="sheet-progress-copy">
            <span>{stars}/20 ดวง</span>
            <strong>{Math.round((stars / 20) * 100)}%</strong>
          </div>
          <div className="sheet-progress-bar" aria-hidden="true">
            <span style={{ width: `${(stars / 20) * 100}%` }} />
          </div>
        </div>

        <div className="sheet-timeline" aria-label="รายการ progress สะสมทั้งหมด">
          {rewardGroups.map((group) => {
            const isUnlocked = stars >= group.threshold;
            const isNext = nextMilestone === group.threshold;
            const statusText = isUnlocked
              ? "ปลดล็อกแล้ว"
              : isNext
                ? `อีก ${group.threshold - stars} ดวง`
                : "ยังไม่ถึงขั้น";

            return (
              <article
                className={`timeline-item ${isUnlocked ? "is-unlocked" : ""} ${isNext ? "is-next" : ""}`}
                key={group.threshold}
              >
                <div className="timeline-marker" aria-hidden="true">
                  <span>{isUnlocked ? "✓" : group.threshold}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-item-header">
                    <div>
                      <p>สะสมครบ {group.threshold} ดวง</p>
                      <h3>{statusText}</h3>
                    </div>
                    <button className={isUnlocked ? "timeline-claim active" : "timeline-claim"} type="button">
                      {isUnlocked ? "รับได้" : "ล็อก"}
                    </button>
                  </div>

                  {group.rewards.map((reward) => (
                    <div className="timeline-reward" key={reward.title}>
                      <img src={reward.image} alt="" />
                      <p>{reward.title.replace("\n", " ")}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function getRewardGroups() {
  const groups = new Map<number, Reward[]>();

  for (const reward of rewards) {
    groups.set(reward.threshold, [...(groups.get(reward.threshold) ?? []), reward]);
  }

  return Array.from(groups.entries()).map(([threshold, groupRewards]) => ({
    threshold,
    step: groupRewards[0].step,
    rewards: groupRewards,
  }));
}

function getTrackPoints(stars: number): TrackPoint[] {
  if (stars >= 18) {
    return [
      { threshold: 12, label: "12 ดวง", kind: "reward" },
      { threshold: 15, label: "15 ดวง", kind: "reward" },
      { threshold: 17, label: "17 ดวง", kind: "reward" },
      { threshold: 20, label: "20 ดวง", kind: "reward" },
    ];
  }

  if (stars >= 12) {
    return [
      { threshold: 10, label: "10 ดวง", kind: "reward" },
      { threshold: 12, label: "12 ดวง", kind: "reward" },
      { threshold: 15, label: "15 ดวง", kind: "reward" },
      { threshold: 17, label: "17 ดวง", kind: "reward" },
    ];
  }

  if (stars >= 8) {
    return [
      { threshold: 5, label: "5 ดวง", kind: "reward" },
      { threshold: 7, label: "7 ดวง", kind: "reward" },
      { threshold: 10, label: "10 ดวง", kind: "reward" },
      { threshold: 12, label: "12 ดวง", kind: "reward" },
    ];
  }

  return [
    { threshold: 0, label: "", kind: "empty" },
    { threshold: 3, label: "3 ดวง", kind: "reward" },
    { threshold: 5, label: "5 ดวง", kind: "reward" },
    { threshold: 7, label: "7 ดวง", kind: "reward" },
  ];
}

function getTrackProgressPercent(stars: number, points: TrackPoint[]) {
  const positions = points.map((_, index) => index * (100 / (points.length - 1)));

  if (stars === 0) {
    return 0;
  }

  if (stars <= points[0].threshold) {
    return (stars / points[0].threshold) * positions[0];
  }

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = points[index - 1];
    const currentPoint = points[index];

    if (stars <= currentPoint.threshold) {
      const tierProgress =
        (stars - previousPoint.threshold) /
        (currentPoint.threshold - previousPoint.threshold);

      return (
        positions[index - 1] +
        tierProgress * (positions[index] - positions[index - 1])
      );
    }
  }

  return 100;
}
