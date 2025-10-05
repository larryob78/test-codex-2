CREATE TABLE IF NOT EXISTS events_impressions (
  org_id String,
  campaign_id String,
  creative_id String,
  ts DateTime,
  country String,
  device String,
  cost Float64,
  revenue Float64
) ENGINE = MergeTree() ORDER BY (org_id, campaign_id, ts);

CREATE TABLE IF NOT EXISTS campaign_hourly (
  org_id String,
  campaign_id String,
  hour DateTime,
  impressions UInt64,
  spend Float64
) ENGINE = SummingMergeTree() ORDER BY (org_id, campaign_id, hour);
