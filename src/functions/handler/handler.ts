import { parse } from "node-html-parser";

const links = [
  "https://www.lounaat.info/lounas/viikinkiravintola-harald/jyvaskyla",
  "https://www.lounaat.info/lounas/hox-city/jyvaskyla",
  "https://www.lounaat.info/lounas/bella-roma/jyvaskyla",
  "https://www.lounaat.info/lounas/revolution/jyvaskyla",
  "https://www.lounaat.info/lounas/amarillo/jyvaskyla",
  "https://www.lounaat.info/lounas/baari-verso/jyvaskyla",
  "https://www.lounaat.info/lounas/scandic-jyvaskyla/jyvaskyla",
  "https://www.lounaat.info/lounas/shalimar/jyvaskyla",
  "https://www.lounaat.info/lounas/green-egg/jyvaskyla",
];

const stupidTuesday = [
  {
    type: "section",
    text: {
      type: "plain_text",
      text: "Tänään on tyhmä tiistai. Syödääm eväitä.",
      emoji: true,
    },
  },
];

const shalimar = [
  {
    type: "section",
    text: {
      type: "plain_text",
      text: "Tänään on torstai. Syödääm Shalimarissa.",
      emoji: true,
    },
  },
];

export const main = async () => {
  const d = new Date();
  const day = d.getDay();

  if (day === 2) {
    await sendToSlack(stupidTuesday);
    return;
  }

  if (day === 4) {
    await sendToSlack(shalimar);
    return;
  }

  const list = [];

  for (const i in links) {
    const link = links[i];

    const res = await fetch(link);

    const body = await res.text();

    const data = parse(body);

    const menu = data.querySelector("#menu");

    const name = data.querySelector('[itemprop="name"]');

    const tmp = {
      title: name.childNodes[0]._rawText.trim(),
      content: "",
    };

    menu.childNodes[day].childNodes.forEach((node, index) => {
      if (index === 1) {
        node.childNodes[0].childNodes.forEach((item) => {
          const price = item.childNodes[1]?.childNodes[0]._rawText;
          const dish = item.childNodes[0]?.childNodes[0]._rawText;
          tmp.content += `${price ? price + " -" : ""} ${dish} \n`;
        });
      }
    });
    list.push(tmp);
  }

  const blocks = list.flatMap((item) => {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${item.title}*`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: item.content || "No data",
        },
      },
    ];
  });

  await sendToSlack(blocks);
};

const sendToSlack = async (blocks: any) => {
  await fetch(process.env.SLACK_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      attachments: [
        {
          color: "#f2c744",
          blocks: blocks,
        },
      ],
    }),
  });
};
