import React from 'react';
import { LoadData } from '../../../shared/types';

import {
  Axis,
  LineSeries,
  XYChart,
  Tooltip,
  lightTheme,
  darkTheme,
} from '@visx/xychart';
import { curveLinear } from '@visx/curve';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import './LoadGraph.scss';

export default function LoadGraph({
  useLightTheme,
  height,
  width,
  loadData,
  label,
}: {
  useLightTheme: boolean;
  height: number;
  width: number;
  loadData: LoadData;
  label: string
}) {

  const data: [number, number][] = loadData.x.map((x, i) => [x, loadData.y[i]]);
  const accessors = {
    xAccessor: (d: [number, number]): number => d[0],
    yAccessor: (d: [number, number]): number => d[1],
  };

  // TODO add legends, title, axis labels
  // TODO fix typescript types

  return (
    <Stack className='load-graph'>
      <Typography variant='body1' sx={{ mb: 0 }}>{label}</Typography>
      <XYChart
        theme={!useLightTheme ? lightTheme : darkTheme}
        height={height}
        width={width}
        xScale={{ type: 'band' }}
        yScale={{ type: 'linear' }}
      >
        <Axis
          label='Time of day'
          orientation='bottom'
          numTicks={12}
        />
        <Axis
          label='Average number of server calls'
          orientation='left'
          numTicks={12}
        />
        <LineSeries
          dataKey={label}
          data={data}
          curve={curveLinear}
          {...accessors}
        />
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          renderTooltip={({ tooltipData, colorScale }) => {
            if (tooltipData && colorScale && tooltipData.nearestDatum) {
              const hour: number = Math.floor(accessors.xAccessor(tooltipData.nearestDatum.datum as [number, number]));
              const minutes: number = Math.round((accessors.xAccessor(tooltipData.nearestDatum.datum as [number, number]) % 1) * 60);

              return (
                <div>
                  <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
                    {tooltipData.nearestDatum.key}
                  </div>
                  {`time: ${hour < 10 ? '0' : ''}${hour}:${minutes}`}
                  {', '}
                  {'# calls: ' + accessors.yAccessor(tooltipData.nearestDatum.datum as [number, number])}
                </div>
              );
            }
          }}
        />
      </XYChart>
    </Stack>
  );
}
