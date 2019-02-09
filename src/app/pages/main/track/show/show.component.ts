import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShowResolvedData } from './show.resolver';
import { msToHHMMSS } from '../../../../core/util/util';
import { AudioFeatures } from '../../../../core/api/responses/audio-features';
import { keyName } from '../../../../core/api/responses/key';

@Component({
  selector: 'sp-track-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {

  data?: ShowResolvedData;

  get dataSource(): {name: string, value: string | number, note?: string}[] {
    if (!this.data) {
      return [];
    }
    const f = this.data.features;
    return [
      {name: 'Key', value: `${keyName(f.key)} ${f.mode ? 'Major' : 'minor'}`},
      {name: 'Tempo', value: f.tempo + ''},
      {name: 'Duration', value: msToHHMMSS(f.duration_ms)},
      {name: 'Time Signature', value: f.time_signature, note: 'トラックの全体的な拍子の推定値。拍子記号(メーター)は、各小節(または小節)の拍数を指定するための表記規則です。'},
      {name: 'Acousticness', value: f.acousticness, note: 'トラックが音響的かどうかの0.0から1.0までの信頼度。 1.0はトラックが音響的であるという高い信頼性を表します。'},
      {name: 'Danceability', value: f.danceability, note: 'ダンスアビリティとは、テンポ、リズムの安定性、ビートの強さ、全体的な規則性などの音楽的要素の組み合わせに基づいて、トラックがダンスにどの程度適しているかを表します。 0.0の値は最も踊りやすく、1.0は最も踊りやすいです。'},
      {name: 'Energy', value: f.energy, note: 'エネルギーは0.0から1.0までの尺度であり、強度と活動の知覚的尺度を表します。一般的に、エネルギッシュなトラックは速く、大きく、そして騒々しく感じます。例えば、デスメタルはエネルギーが高いのに対し、バッハのプレリュードはその規模では低いスコアです。この属性に寄与する知覚的特徴は、ダイナミックレンジ、知覚ラウドネス、音色、開始速度、および一般的なエントロピーを含む。'},
      {name: 'Instrumentalness', value: f.instrumentalness, note: 'トラックにボーカルが含まれていないかどうかを予測します。 「Ooh」と「aah」の音は、この文脈では道具として扱われます。ラップまたは話された単語トラックは明らかに「ボーカル」です。器用さの値が1.0に近いほど、トラックにボーカルコンテンツが含まれていない可能性が高くなります。 0.5を超える値はインストゥルメンタルトラックを表すことを目的としていますが、値が1.0に近づくにつれて信頼性は高くなります。'},
      {name: 'Liveness', value: f.liveness, note: 'レコーディング内のオーディエンスの存在を検出します。より高い活性値は、トラックがライブで実行された可能性の増加を表す。 0.8を超える値は、トラックがライブである可能性が高いです。'},
      {name: 'Loudness', value: f.loudness, note: 'トラックの全体的な音量(デシベル(dB))。ラウドネス値はトラック全体で平均され、トラックの相対的なラウドネスを比較するのに役立ちます。ラウドネスは、体の強さ(振幅)の主な心理的相関関係である音の質です。値は通常-60から0 dbの範囲です。'},
      {name: 'Speechiness', value: f.speechiness, note: '発話は、トラック内の話されている単語の存在を検出します。録音(例えば、トークショー、オーディオブック、詩)がより独占的に話すようなものであればあるほど、その属性値は1.0に近づく。 0.66を超える値は、おそらく完全に話し言葉でできているトラックを表します。 0.33と0.66の間の値はラップ音楽のような場合を含めて、セクションまたは層になって音楽と​​スピーチの両方を含むかもしれないトラックを表します。 0.33未満の値は、音楽やその他の音声以外のトラックを表している可能性があります。'},
      {name: 'Valence', value: f.valence, note: 'トラックによって伝えられる音楽的な前向きさを表す0.0から1.0の間の尺度。価数の高いトラックはよりポジティブに聞こえます(例：幸せ、陽気、幸福感)。'},
    ];
  }

  get externals() {
    if (!this.data) {
      return [];
    }
    return Object.keys(this.data.track.external_urls)
      .map(title => ({title, url: this.data.track.external_urls[title]}));
  }

  get duration() {
    if (!this.data) {
      return '';
    }
    return msToHHMMSS(this.data.features.duration_ms);
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => this.data = data.data);
  }

}
