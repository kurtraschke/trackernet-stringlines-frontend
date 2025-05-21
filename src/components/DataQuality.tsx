import DataQuality from "./DataQualityComponent.tsx";

const bakerloo = (
  <DataQuality
    status={"warning"}
    labelText={"Data quality mixed"}
    headerContent={<div>No data for London Overground</div>}
    bodyContent={
      <div>
        Data quality for Bakerloo Line trips is generally <em>good</em>. London
        Overground trips between Queen's Park and Watford Junction do not appear
        here as they cannot be uniquely identified based on data in the
        Trackernet API (their headcodes are not passed through and they do not
        have unique trip numbers).
      </div>
    }
  />
);

const central = (
  <DataQuality
    status={"info"}
    labelText={"Data quality good"}
    headerContent={<div>Data quality mostly good</div>}
    bodyContent={
      <div>
        Data quality for the Central Line is mostly good although there are
        issues with directionality around Hainault (as is to be expected).
      </div>
    }
  />
);

const met = (
  <DataQuality
    status={"warning"}
    labelText={"Data quality mixed"}
    headerContent={<div>Data quality poor outside CBTC territory</div>}
    bodyContent={
      <div>
        Data quality on all Sub-Surface Railway lines in CBTC territory is
        fairly good. However, outside CBTC territory, the quality is quite poor.
        Trains generally lose their trip numbers, which prevents unique
        identification of trips. Trains sometimes also retain the same trip
        number despite having reversed at a terminal.
      </div>
    }
  />
);

const jubilee = (
  <DataQuality
    status={"success"}
    labelText={"Data quality excellent"}
    headerContent={<div>Data quality excellent</div>}
    bodyContent={
      <div>
        Data quality on the Jubilee Line is <em>excellent</em>. No complaints
        whatsoever.
      </div>
    }
  />
);

const victoria = (
  <DataQuality
    status={"success"}
    labelText={"Data quality very good"}
    headerContent={<div>Data quality very good</div>}
    bodyContent={
      <div>
        Data quality on the Victoria Line is <em>very good</em>. The main issue
        is that we do not get actuals (i.e. an "At" location) for the termini,
        so the last event for a trip will be "Between Stockwell and Brixton" or
        "Between Blackhorse Road and Walthamstow Central".
      </div>
    }
  />
);

const drain = (
  <DataQuality
    status={"danger"}
    labelText={"Critical data quality problems"}
    headerContent={<div>No trip numbers</div>}
    bodyContent={
      <div>
        The lack of unique trip numbers for trips on the Waterloo & City Line
        means it is not presently possible to generate a stringline diagram
        without additional post-processing to infer trips.
      </div>
    }
  />
);

const dataQualityByConfiguration = new Map(
  Object.entries({
    "100": bakerloo,
    "101": bakerloo,
    "200": central,
    "201": central,
    "500": jubilee,
    "501": jubilee,
    "600": met,
    "601": met,
    "900": victoria,
    "901": victoria,
    "1000": drain,
    "1001": drain,
  }),
);

function dataQualityForConfiguration(configurationId: string) {
  return dataQualityByConfiguration.get(configurationId) ?? <DataQuality />;
}

export { dataQualityForConfiguration };
