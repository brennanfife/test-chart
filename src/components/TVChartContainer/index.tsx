//@ts-nocheck
import './index.css';

import * as React from 'react';

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  LanguageCode,
  ResolutionString,
  widget,
} from '../../charting_library';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];

  // BEWARE: no trailing slash is expected in feed URL
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions['library_path'];
  chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
}

//eslint-disable-next-line
export interface ChartContainerState {}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  //eslint-disable-next-line
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

export class TVChartContainer extends React.PureComponent<
  Partial<ChartContainerProps>,
  ChartContainerState
> {
  public static defaultProps: ChartContainerProps = {
    symbol: 'AAPL',
    interval: 'D' as ResolutionString,
    containerId: 'tv_chart_container',
    datafeedUrl: 'https://demo_feed.tradingview.com',
    libraryPath: '/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
  };

  private tvWidget: IChartingLibraryWidget | null = null;

  
  public componentDidMount(): void {
    const colors = {
      green: '#5ab9a5',
      red: '#d73159',
      transparentBlack: 'rgba(255,255,255,.06)',
      text: '#979eb9',
      crossHair: '#4A5F78',
      background: '#0d1126',
      white: '#ffffff',
      studies: '#192041',
  };

    //eslint-disable-next-line
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: this.props.symbol as string,
      datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(
        this.props.datafeedUrl,
      ),
      interval: this.props.interval as ChartingLibraryWidgetOptions['interval'],
      container: this.props
        .containerId as ChartingLibraryWidgetOptions['container_id'],
      library_path: this.props.libraryPath as string,

      locale: getLanguageFromURL() || 'en',
      disabled_features: ['use_localstorage_for_settings'],
      enabled_features: ['study_templates'],
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      theme: 'Dark',
      overrides: {
                    'mainSeriesProperties.style': 1,
                    'mainSeriesProperties.barStyle.upColor': colors.green,
                    'mainSeriesProperties.barStyle.downColor': colors.red,
                    'mainSeriesProperties.candleStyle.upColor': colors.green,
                    'mainSeriesProperties.candleStyle.downColor': colors.red,
                    'mainSeriesProperties.candleStyle.borderUpColor': colors.green,
                    'mainSeriesProperties.candleStyle.borderDownColor': colors.red,
                    'mainSeriesProperties.candleStyle.wickUpColor': colors.green,
                    'mainSeriesProperties.candleStyle.wickDownColor': colors.red,
                    'paneProperties.background': colors.red,
                    'paneProperties.vertGridProperties.color': colors.transparentBlack,
                    'paneProperties.horzGridProperties.color': colors.transparentBlack,
                    'paneProperties.gridProperties.color': colors.transparentBlack,
                    'paneProperties.crossHairProperties.color': colors.crossHair,
                    'scalesProperties.lineColor': colors.transparentBlack,
                    'scalesProperties.textColor': colors.text,
                    'mainSeriesProperties.hollowCandleStyle.upColor': colors.green,
                    'mainSeriesProperties.hollowCandleStyle.downColor': colors.red,
                    'mainSeriesProperties.hollowCandleStyle.borderUpColor': colors.green,
                    'mainSeriesProperties.hollowCandleStyle.borderDownColor': colors.red,
                    'mainSeriesProperties.baselineStyle.baselineColor': colors.red,
                },
    };

    const tvWidget = new widget(widgetOptions);
    this.tvWidget = tvWidget;

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute('title', 'Click to show a notification popup');
        button.classList.add('apply-common-tooltip');
        button.addEventListener('click', () =>
          tvWidget.showNoticeDialog({
            title: 'Notification',
            body: 'TradingView Charting Library API works correctly',
            callback: () => {
              console.log('Noticed!');
            },
          }),
        );
        button.innerHTML = 'Check API';
      });
    });
  }

  public componentWillUnmount(): void {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  public render(): JSX.Element {
    return <div id={this.props.containerId} className={'TVChartContainer'} />;
  }
}
