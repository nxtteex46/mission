"use client";

import { useState } from "react";

type Reward = {
  step: string;
  image: string;
  title: string;
  remaining: string;
};

const rewards: Reward[] = [
  {
    step: "สะสมครบ 3 ดวง",
    image: "/m-card/reward-oh-juice.png",
    title: "คูปองส่วนลดร้าน OH JUICE\nมูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 207/800",
  },
  {
    step: "สะสมครบ 5 ดวง",
    image: "/m-card/reward-starbucks.png",
    title: "คูปอง STARBUCKS มูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 399/1,000",
  },
  {
    step: "สะสมครบ 7 ดวง",
    image: "/m-card/reward-sushiro.png",
    title: "คูปอง SUSHIRO มูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 130/550",
  },
  {
    step: "สะสมครบ 10 ดวง",
    image: "/m-card/reward-cash-200.png",
    title: "รับ CASH COUPON\nสำหรับอิ่มในศูนย์ฯ มูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 258/600",
  },
  {
    step: "สะสมครบ 12 ดวง",
    image: "/m-card/reward-yakiniku.png",
    title: "คูปอง เนื้อคารูบิ 50 กรัม หรือ หมูคารูบิ 50 กรัม ร้าน YAKINIKU LIKE",
    remaining: "ผู้ใช้สิทธิ์ครบแล้ว",
  },
  {
    step: "สะสมครบ 15 ดวง",
    image: "/m-card/reward-chagee.png",
    title: "คูปองส่วนลดร้าน CHAGEE\nมูลค่า 100 บาท",
    remaining: "จำนวนสิทธิ์ 91/600",
  },
  {
    step: "สะสมครบ 17 ดวง",
    image: "/m-card/reward-mk.png",
    title: "คูปองส่วนลดร้าน MK RESTAURANTS\nมูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 33/500",
  },
  {
    step: "สะสมครบ 17 ดวง",
    image: "/m-card/reward-katei.png",
    title: "คูปองส่วนลดร้าน KATEI SHABU\nมูลค่า 200 บาท",
    remaining: "จำนวนสิทธิ์ 87/290",
  },
  {
    step: "สะสมครบ 20 ดวง",
    image: "/m-card/reward-cash-500.png",
    title: "รับ CASH COUPON\nสำหรับอิ่มในศูนย์ฯ มูลค่า 500 บาท",
    remaining: "จำนวนสิทธิ์ 146/300",
  },
];

export default function Home() {
  const [joined, setJoined] = useState(false);

  return (
    <main className="prototype-stage">
      <section className="phone-shell" aria-label="M Card mission detail">
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
            <button className="icon-button" aria-label="ย้อนกลับ">
              <img src="/m-card/back-line.svg" alt="" className="back-line" />
              <img src="/m-card/back-head.svg" alt="" className="back-head" />
            </button>
            <h1>รายละเอียดภารกิจ</h1>
          </header>
        </div>

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

            {joined ? <ProgressCard /> : <JoinPrompt />}

            <p className="description">
              ช้อปร้านอาหารในศูนย์ฯ ครบทุก 400 บาท รับ 1 ดวง สะสมครบตามขั้นเพื่อรับรางวัล
            </p>
            <button className="terms-button" type="button">
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
                        <button
                          className={joined && index === 0 ? "unlock-pill active" : "unlock-pill"}
                          type="button"
                        >
                          {joined && index === 0 ? "แลกรางวัล" : "ยังไม่ปลดล็อก"}
                        </button>
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
              onClick={() => setJoined(true)}
            >
              เข้าร่วมภารกิจ
            </button>
            <p>เข้าร่วมครั้งเดียว ระบบบันทึกความคืบหน้าให้อัตโนมัติ</p>
          </div>
        )}
        <div className="home-indicator" aria-hidden="true">
          <span />
        </div>
      </section>
    </main>
  );
}

function JoinPrompt() {
  return (
    <div className="join-card">
      <h3>เข้าร่วมภารกิจเพื่อเริ่มภารกิจ</h3>
      <p>
        ใช้จ่ายร้านอาหารในศูนย์ฯ ครบทุก 400 บาท รับ 1 ดวง แลกรางวัลได้สูงสุด 9 รายการ
      </p>
    </div>
  );
}

function ProgressCard() {
  return (
    <div className="progress-card" aria-label="ความคืบหน้าภารกิจ">
      <div className="progress-header">
        <h3>สะสมแล้ว 0/20 ดวง</h3>
        <p>ได้รับแล้ว 0/8</p>
      </div>

      <div className="progress-track" aria-hidden="true">
        <img className="dot-run run-1" src="/m-card/dot-run.svg" alt="" />
        <img className="dot-run run-2" src="/m-card/dot-run-alt.svg" alt="" />
        <img className="dot-run run-3" src="/m-card/dot-run.svg" alt="" />
        <img className="progress-start" src="/m-card/progress-start.svg" alt="" />

        {[3, 5, 7].map((tier, index) => (
          <div className={`milestone milestone-${index + 1}`} key={tier}>
            <span>
              <img src="/m-card/lock.svg" alt="" />
            </span>
            <p>{tier} ดวง</p>
          </div>
        ))}

        <img className="more-tiers" src="/m-card/more-tiers.svg" alt="" />
      </div>

      <div className="progress-divider" />

      <div className="next-reward">
        <div className="next-reward-thumb">
          <img src="/m-card/progress-reward-thumb.png" alt="" />
          <img src="/m-card/progress-reward-thumb-overlay.png" alt="" />
        </div>
        <div className="next-reward-text">
          <p>รางวัลถัดไป</p>
          <h4>คูปองส่วนลดร้าน OH JUICE มูลค่า 100 บาท</h4>
        </div>
        <span className="next-pill">อีก 3 ดวง</span>
      </div>
    </div>
  );
}
