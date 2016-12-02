import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Table from '../../../../components/Table';
import { getAudiences, getMoreAudiences, getAudienceCount } from '../redux/actions';

export class AudienceTable extends Component {
  displayName: 'AudienceTable'

  componentWillMount() {
    this.offset = 0;
    this.props.getAudiences(this.props.segmentId, 0, 10);
    const segmentIds = this.props.segmentId ? [this.props.segmentId] : [];
    this.props.getAudienceCount(segmentIds);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.segmentId && nextProps.segmentId !== this.props.segmentId) {
      this.offset = 0;
      this.props.getAudiences(nextProps.segmentId, 0, 10);
      this.props.getAudienceCount([nextProps.segmentId]);
    }
  }

  loadMoreData = () => {
    this.offset += 10;
    this.props.getMoreAudiences(this.props.segmentId, this.offset, 10);
  }

  props: {
    audienceCounts: Object,
    segmentId: string,
    audiences: Array<any>,
    loading: bool,
    getAudiences: Function,
    getMoreAudiences: Function,
    getAudienceCount: Function
  }

  render() {
    const { audiences, loading, audienceCounts, segmentId } = this.props;
    const audienceMapped = audiences.map((u) => ({
      ...u.userDevice,
      ...u
    }));

    const model = {
      name: { title: 'Name' },
      email: { title: 'Email' },
      pushNotificationEnabled: { title: 'Push Enabled' },
      gender: { title: 'Gender' },
      devicePlatform: { title: 'Platform' },
      deviceVendor: { title: 'Vendor' },
      deviceModel: { title: 'Model' }
    };

    const count = audienceCounts[segmentId || 'all'];

    return (
      <div>
        <small>Results for { count } users</small>
        <Table model={ model } source={ audienceMapped } loading={ loading } selectable={ false } />
        <small>Showing { audiences.length } of { count } { audiences.length < count ? (<a href="#" onClick={ this.loadMoreData }>Load More</a>) : null }</small>
      </div>
    );
  }
}

const mapStatesToProps = ({ analytics: { audiences, loading, audienceCounts } }) => ({
  audienceCounts,
  audiences,
  loading
});

const mapDispatchToProps = (dispatch) => ({
  getAudiences: (...args) => dispatch(getAudiences(...args)),
  getMoreAudiences: (...args) => dispatch(getMoreAudiences(...args)),
  getAudienceCount: (segmentIds) => dispatch(getAudienceCount(segmentIds))
});

export default translate()(
  connect(mapStatesToProps, mapDispatchToProps)(AudienceTable)
);
