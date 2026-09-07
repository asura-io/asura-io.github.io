# image manifest

This manifest maps each canonical source image basename to its local source asset and the retained route where it is rendered. Squarespace responsive query variants (`format=100w` through `format=2500w`) resolve to the same canonical URL and are intentionally represented once.

| canonical basename(s) | local asset | rendered route(s) |
| --- | --- | --- |
| `D279C9FC-0491-45CF-948A-7E3B989A8FA9_1_102_a.jpeg` | `src/assets/images/D279C9FC-0491-45CF-948A-7E3B989A8FA9_1_102_a.jpeg` | `/work/contextual-modernism`, `/` and `/work` cover |
| `D279C9FC-0491-45CF-948A-7E3B989A8FA9_1_102_a.jpg` | `src/assets/images/D279C9FC-0491-45CF-948A-7E3B989A8FA9_1_102_a.jpg` | `/work/contextual-modernism` gallery |
| contextual modernism remaining 7 JPEG basenames | matching files in `src/assets/images/` | `/work/contextual-modernism` gallery |
| `photo_in_progress.jpg` (asiatic/about URL prefixes are identical) | `src/assets/images/photo_in_progress.jpg` | `/work/asiatic` cover and gallery, source about image |
| `photo_in_progress.jpg` (homepage/work URL prefix is distinct) | `src/assets/images/photo_in_progress_home.jpg` | `/work/asiatic` gallery; source `/` and `/work` shared image |
| `bodhisattva_I_ful.jpg` | `src/assets/images/bodhisattva_I_ful.jpg` | `/work/bodhisattva` cover, `/` and `/work` cover |
| `P4020002.JPG`, `P4020003.JPG`, `P4020005+copy+5.jpg`, `P4020006+copy.jpg`, `P4020008+copy.jpg`, `P4020009.JPG`, `P4020010.jpg`, `P4020011.JPG`, `P4020012.JPG`, `P4020015+copy.jpg`, `P4020016.JPG`, `P4020017.JPG`, `P4020018.JPG`, `P4020019.JPG`, `P4020020.JPG`, `P4020021.JPG`, `P4020022.JPG` | matching normalized files in `src/assets/images/` | `/work/bodhisattva` gallery |
| `G_Acharya_hero_b_20220511_02157.jpg`, `Gautham-Acharya---Shiva-Sumi-Ink-30x40.jpg`, `Ganesha-Gautham-Acharya-18x24.jpg`, `Old-Man-18x24.jpg` | matching files in `src/assets/images/` | `/work/american-vedas` gallery |
| `three_with_chair-a969efd9d0dfb70e335e541559ad8c26.jpg` | `src/assets/images/three_with_chair-a969efd9d0dfb70e335e541559ad8c26.jpg` | `/work/american-vedas` cover, `/` and `/work` cover |

The seven contextual modernism gallery rows are the basenames `255314FB-85B5-42D4-AA0E-09F0323B256E_1_102_a.jpeg`, `4DB06305-60A1-4265-9A04-E2AC8FA3CBD9_1_102_a.jpeg`, `BD4A2A76-149A-4E9A-BD92-AAA1215968D9_1_102_a.jpeg`, `AD31A080-7AD0-4C4F-80EF-19E22C6B32DE_1_105_c.jpeg`, `595EBF80-C765-4010-BC99-C53CA9B9FECD_1_105_c.jpeg`, `7718A135-8212-48CB-94AF-47F77031CD62_1_102_a.jpeg`, `B9379C3C-71C0-4B94-A6CD-74047913A002_1_102_a.jpeg`, plus `2C44D012-A66F-45D1-8324-D9987EAF5323_1_102_a.jpeg` (eight gallery images; the contextual cover is the ninth image). Local filenames are normalized only where Squarespace `+` characters became underscores.
